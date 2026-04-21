# Spring Boot for Django Developers
### A guide based on the Silver Guide backend

You already know Django. This tutorial maps every concept you know onto what was built here in Java + Spring Boot. SQL/MySQL knowledge is assumed throughout.

---

## 1. The Big Picture

| Concept | Django | Spring Boot |
|---|---|---|
| Language | Python | Java |
| Package manager | pip / pyproject.toml | Maven (`pom.xml`) |
| Entry point | `manage.py runserver` | `main()` in `SilverGuideApplication.java` |
| Config file | `settings.py` | `application.properties` + `@Configuration` classes |
| ORM | Django ORM | JPA / Hibernate |
| Migrations | `makemigrations` / `migrate` | Auto via `ddl-auto=update` (dev) or Flyway/Liquibase (prod) |
| Views | `views.py` | `@RestController` classes |
| URL routing | `urls.py` | `@RequestMapping` annotations on controllers |
| Forms / Serializers | DRF `Serializer` | DTOs (plain classes) + Bean Validation |
| Middleware | `MIDDLEWARE` list | `Filter` / `OncePerRequestFilter` |
| Auth | `django.contrib.auth` | Spring Security |
| WSGI/ASGI server | Gunicorn / Uvicorn | Embedded Tomcat (ships inside the JAR) |

---

## 2. Project Structure

```
Django                          Spring Boot
──────────────────────────────  ──────────────────────────────────────────
myproject/                      com/silverguide/backend/
  wsgi.py                         SilverGuideApplication.java    ← entry point
  urls.py                         controller/AuthController.java ← views/urls
  settings.py                     config/SecurityConfig.java     ← settings
myapp/
  models.py                       entity/User.java               ← models
  views.py                        repository/UserRepository.java ← ORM queries
  views.py                        service/AuthService.java       ← business logic
  serializers.py                  dto/RegisterRequest.java       ← serializers
  [middleware]                    security/JwtAuthFilter.java    ← middleware
requirements.txt              pom.xml
```

Spring Boot has no equivalent of Django's "app" concept. Everything is just Java packages under one namespace.

---

## 3. Dependencies — `pom.xml` vs `requirements.txt`

In Django you write:
```
djangorestframework
djangorestframework-simplejwt
mysqlclient
```

In Spring Boot, dependencies go in `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>       <!-- HTTP server + JSON -->
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>  <!-- auth framework -->
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>  <!-- ORM -->
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>             <!-- MySQL driver -->
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>                     <!-- JWT -->
</dependency>
```

Maven downloads these and compiles them into a single self-contained JAR. The JAR includes an embedded Tomcat server — no separate server process needed.

---

## 4. Configuration — `settings.py` vs `application.properties`

**Django `settings.py`:**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'silverguide'),
        'USER': os.environ.get('DB_USERNAME', 'sguser'),
    }
}
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
```

**Spring Boot `application.properties`:**
```properties
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:silverguide}
spring.datasource.username=${DB_USERNAME:sguser}
spring.datasource.password=${DB_PASSWORD:sgpassword}
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:5500}
app.jwt.secret=${JWT_SECRET:some-long-key}
```

The `${VAR:default}` syntax is Spring's version of `os.environ.get('VAR', 'default')`.

Some settings that live in `settings.py` in Django are instead written as `@Configuration` classes in Spring Boot (see Section 9).

---

## 5. Models → Entities

Django models use Python class attributes. Spring Boot uses Java classes annotated with JPA annotations, plus **Lombok** to eliminate boilerplate.

**Django:**
```python
class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

**Spring Boot (`entity/User.java`):**
```java
@Data               // Lombok: generates getters, setters, equals, hashCode, toString
@Builder            // Lombok: generates a builder pattern
@NoArgsConstructor  // Lombok: generates User()
@AllArgsConstructor // Lombok: generates User(id, name, email, ...)
@Entity             // JPA: this class maps to a DB table
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)  // auto-fills createdAt/updatedAt
public class User implements UserDetails {      // UserDetails = Django's AbstractUser

    @Id
    @UuidGenerator                              // auto-generate UUID (like Django's UUIDField)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "is_staff")
    @Builder.Default
    private boolean isStaff = false;

    @CreatedDate                                // auto_now_add=True
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
```

**Key differences:**
- `@Data` / `@Builder` / `@NoArgsConstructor` are Lombok — they generate Java boilerplate at compile time. Without Lombok you'd write 50+ lines of getters/setters by hand.
- `implements UserDetails` is the Spring Security equivalent of extending `AbstractUser`. It forces you to implement methods like `getAuthorities()`, `getPassword()`, `isEnabled()`.
- There are no separate migration files. With `spring.jpa.hibernate.ddl-auto=update`, Hibernate inspects your entity classes at startup and updates the DB schema automatically.

---

## 6. Migrations

In Django:
```bash
python manage.py makemigrations
python manage.py migrate
```

In this Spring Boot project, `application.properties` has:
```properties
spring.jpa.hibernate.ddl-auto=update
```

This tells Hibernate to automatically create/alter tables to match entity classes on every startup. It's convenient for development but **not recommended for production** — in prod you'd use Flyway or Liquibase (the Spring equivalents of Django migrations).

---

## 7. Repositories — Django ORM vs Spring Data JPA

**Django:**
```python
User.objects.filter(email=email).first()
User.objects.filter(email=email).exists()
Article.objects.filter(published=True)
```

**Spring Boot (`repository/UserRepository.java`):**
```java
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

Spring Data JPA **generates the SQL from the method name**. `findByEmail` → `SELECT * FROM users WHERE email = ?`. `existsByEmail` → `SELECT COUNT(*) > 0 FROM users WHERE email = ?`.

More examples from the codebase:
```java
// ArticleRepository
List<Article> findByPublishedTrue();          // WHERE published = true
List<Article> findByAuthorId(String id);      // WHERE author_id = ?
List<Article> findByTopicId(Long id);         // WHERE topic_id = ?

// EngagementLikeRepository
boolean existsByUserIdAndArticleId(String userId, Long articleId);  // WHERE user_id=? AND article_id=?
```

`JpaRepository<Entity, IdType>` also gives you free methods like:
- `save(entity)` → INSERT or UPDATE
- `findById(id)` → SELECT by PK
- `findAll()` → SELECT *
- `deleteById(id)` → DELETE

You almost never write SQL directly.

---

## 8. DTOs vs Django Serializers

In Django REST Framework you'd write:
```python
class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)
```

In Spring Boot, DTOs (Data Transfer Objects) are plain Java classes with **Bean Validation** annotations:
```java
// dto/RegisterRequest.java
@Data   // Lombok: getters + setters
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
```

When the controller uses `@Valid @RequestBody RegisterRequest request`, Spring validates the incoming JSON against these annotations automatically. Failures throw `MethodArgumentNotValidException`, which is caught by the global exception handler (see Section 11).

There is no equivalent of DRF's `serializer.data` — the controller manually maps the entity to a response DTO (`AuthResponse`).

---

## 9. Views → Controllers

**Django (`views.py`):**
```python
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'token': generate_token(user)}, status=201)
    return Response(serializer.errors, status=400)
```

**Spring Boot (`controller/AuthController.java`):**
```java
@RestController          // = @Controller + auto-JSON responses (like DRF's APIView)
@RequestMapping("/api/auth")   // base URL prefix
@RequiredArgsConstructor       // Lombok: inject all final fields via constructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")           // POST /api/auth/register
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {  // @Valid triggers Bean Validation
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);  // HTTP 201
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));  // HTTP 200
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal User user) {
        // @AuthenticationPrincipal = request.user in Django
        ...
    }
}
```

**URL routing** in Django lives in `urls.py`. In Spring Boot it lives directly on the controller method via `@GetMapping`, `@PostMapping`, etc. There is no separate URL file.

---

## 10. Services — The Business Logic Layer

Django typically puts business logic directly in views or a separate `services.py` by convention. Spring Boot formalises this with a **Service layer** annotated `@Service`.

```java
// service/AuthService.java
@Service                // marks this as a Spring-managed service bean
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))  // bcrypt
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return buildAuthResponse(token, user);
    }
}
```

Think of it like this:
- **Controller** = the Django view (handles HTTP request/response)
- **Service** = the Django view's internal logic, extracted into its own class
- **Repository** = the Django ORM queryset methods

This separation is the standard Spring Boot pattern.

---

## 11. Dependency Injection — Spring's Core Magic

In Django, you import things directly:
```python
from myapp.models import User
from myapp.services import send_email
```

In Spring Boot, dependencies are **injected** by the framework:
```java
@RequiredArgsConstructor   // Lombok generates this constructor
public class AuthService {
    private final UserRepository userRepository;  // Spring injects this automatically
    private final PasswordEncoder passwordEncoder; // Spring injects this too
}
```

Spring scans all classes annotated with `@Service`, `@Repository`, `@Component`, `@Controller`, etc. and manages a single instance of each (called a **Bean**). `@RequiredArgsConstructor` tells Spring to inject beans through the constructor.

You never write `new UserRepository()` — Spring handles it.

---

## 12. Exception Handling — `@RestControllerAdvice`

**Django:**
```python
# In DRF, you override exception_handler or use custom exceptions
```

**Spring Boot (`controller/GlobalExceptionHandler.java`):**
```java
@RestControllerAdvice   // catches exceptions thrown by any controller
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ProblemDetail handleEmailConflict(EmailAlreadyExistsException ex) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        detail.setTitle("Email Already Registered");
        return detail;  // Spring serializes this to JSON automatically → HTTP 409
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
        detail.setProperty("errors", errors);
        return detail;  // → HTTP 400 + { "errors": { "email": "Invalid email format" } }
    }
}
```

`ProblemDetail` is a standard RFC 7807 JSON error format built into Spring Boot 3.

---

## 13. Authentication — Spring Security vs `django.contrib.auth`

This is where Spring Boot feels most different from Django. Django handles sessions automatically. This backend uses **stateless JWT** — no server-side sessions at all.

### The flow

```
POST /api/auth/login
  → AuthController.login()
  → AuthService.login()
      → authenticationManager.authenticate(email, password)
          → loads User from DB, checks BCrypt hash
      → jwtService.generateToken(user)    ← creates signed JWT
  ← returns { token, userId, name, email }

Every subsequent request:
  Authorization: Bearer <token>
  → JwtAuthenticationFilter intercepts every request
      → extracts token from header
      → validates signature + expiry
      → loads User from DB
      → sets SecurityContext (= request.user in Django)
  → controller receives @AuthenticationPrincipal User user
```

### The filter (`security/JwtAuthenticationFilter.java`)

```java
// Extends OncePerRequestFilter = runs once per HTTP request (like Django middleware)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, ...) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);  // no token → continue unauthenticated
            return;
        }
        String jwt = authHeader.substring(7);  // strip "Bearer "
        String userEmail = jwtService.extractUsername(jwt);

        // Set the authenticated user in the security context (= request.user)
        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
        if (jwtService.isTokenValid(jwt, userDetails)) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request, response);
    }
}
```

### Access rules (`config/SecurityConfig.java`)

This is the equivalent of Django's `@login_required` decorator, but applied globally:

```java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login").permitAll()  // public
    .anyRequest().authenticated()  // everything else requires a valid JWT
)
.sessionManagement(session ->
    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // no Django sessions
)
```

### Password hashing (`config/ApplicationConfig.java`)

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();  // same BCrypt Django uses by default
}
```

Django uses BCrypt too (with PBKDF2 as default, but BCrypt is available). The hash format is compatible.

---

## 14. CORS

**Django:**
```python
# settings.py
CORS_ALLOWED_ORIGINS = ['http://localhost:5500']
```

**Spring Boot (`config/SecurityConfig.java`):**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));  // from .env
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);  // apply to all routes
    return source;
}
```

The origins themselves come from `.env` → `CORS_ALLOWED_ORIGINS` → `application.properties` → injected via `@Value("${app.cors.allowed-origins}")`.

---

## 15. Roles / Permissions

**Django:**
```python
user.is_staff       # True/False
user.is_superuser   # True/False
@permission_classes([IsAdminUser])
```

**Spring Boot (`entity/User.java`):**
```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
    if (isStaff)     authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));
    if (isSuperuser) authorities.add(new SimpleGrantedAuthority("ROLE_SUPERUSER"));
    return authorities;
}
```

To protect an endpoint by role:
```java
.requestMatchers("/admin/**").hasRole("SUPERUSER")
// or on the method:
@PreAuthorize("hasRole('STAFF')")
```

---

## 16. Soft Delete

The `User` entity has a `deletedAt` field. When it's non-null, `isEnabled()` returns `false`, which causes Spring Security to reject login with a `DisabledException`. This is the Spring equivalent of Django's `is_active = False`.

```java
@Override
public boolean isEnabled() {
    return deletedAt == null;  // null = active, non-null = soft deleted
}
```

---

## 17. The Relationships (Article, Topic, Like, Comment)

Same foreign keys as Django, just annotated differently:

```java
// Django
class Article(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    topic  = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True)

// Spring Boot
@ManyToOne(fetch = FetchType.LAZY)   // LAZY = Django's select_related — only load when accessed
@JoinColumn(name = "author_id")
private User author;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "topic_id")
private Topic topic;
```

```java
// Django (reverse relation)
article.likes.all()

// Spring Boot (on Article entity)
@OneToMany(mappedBy = "article", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<EngagementLike> likes;
```

`cascade = CascadeType.ALL` means deleting an article also deletes its likes/comments (equivalent to `on_delete=models.CASCADE`).

---

## 18. Startup Sequence

When you run `docker-compose up`:

1. MySQL starts and becomes healthy
2. Spring Boot JAR starts
3. Hibernate scans all `@Entity` classes and runs `ddl-auto=update` (creates/alters tables)
4. Spring scans for `@Component`, `@Service`, `@Repository`, `@Controller` beans and wires them together
5. `JwtAuthenticationFilter` is registered into the filter chain
6. Tomcat starts listening on port 8080

The equivalent Django sequence: `migrate` → `runserver` → Django loads `INSTALLED_APPS`, registers middleware, loads URL patterns.

---

## Summary Cheat Sheet

| Django | Spring Boot |
|---|---|
| `models.Model` | `@Entity` class |
| `models.CharField()` | `@Column` on a field |
| `auto_now_add=True` | `@CreatedDate` + `@EnableJpaAuditing` |
| `AbstractUser` | `implements UserDetails` |
| `objects.filter(email=x)` | `findByEmail(x)` in repository |
| `objects.create(...)` | `repository.save(new Entity(...))` |
| `serializers.Serializer` | DTO class with `@NotBlank`, `@Email`, etc. |
| `@api_view` / `APIView` | `@RestController` |
| `urls.py` | `@GetMapping` / `@PostMapping` on controller |
| `MIDDLEWARE` | `Filter` / `OncePerRequestFilter` |
| `request.user` | `@AuthenticationPrincipal User user` |
| `@login_required` | `.anyRequest().authenticated()` in SecurityConfig |
| `django.contrib.auth` | Spring Security |
| `is_active = False` | `deletedAt != null` → `isEnabled() = false` |
| `settings.py` | `application.properties` + `@Configuration` beans |
| `makemigrations` / `migrate` | `ddl-auto=update` (dev) / Flyway (prod) |
| `on_delete=CASCADE` | `cascade = CascadeType.ALL` |
| `select_related` | `fetch = FetchType.LAZY` (load on access) |
