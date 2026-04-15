# Setting Up a Spring Boot Project from Scratch
### For Django developers — step-by-step, with analogies

---

## The Django equivalent

Before diving in, here's the full Django setup flow you already know, so we can mirror it:

```
1. Install Python
2. Create a virtual environment   python -m venv venv
3. Activate it                    source venv/bin/activate
4. Install Django                 pip install django djangorestframework
5. Start a project                django-admin startproject myproject
6. Start an app                   python manage.py startapp myapp
7. Run the server                 python manage.py runserver
```

The Spring Boot equivalent is:

```
1. Install Java 21 (JDK)
2. No virtual environment needed  (Maven handles isolation per project)
3. —
4. No manual installs             (dependencies declared in pom.xml)
5. Generate a project             start.spring.io  (= django-admin startproject)
6. No app concept                 (just Java packages)
7. Run the server                 ./mvnw spring-boot:run
```

---

## Step 1 — Install Java (= Install Python)

Spring Boot requires the **JDK** (Java Development Kit), not just the JRE.
This project uses **Java 21** (the current LTS version).

### macOS
```bash
brew install --cask temurin@21
```
`temurin` is the free, open-source build of Java maintained by Adoptium — the same one used in the Dockerfile (`eclipse-temurin:21`).

### Windows
Download the installer from: https://adoptium.net
Choose: **Temurin 21 (LTS)** → Windows → JDK → .msi

### Verify
```bash
java -version
# openjdk version "21.x.x" ...

javac -version
# javac 21.x.x
```

`java` = the runtime (like `python`).
`javac` = the compiler. Python doesn't need one; Java does because it compiles to bytecode first.

---

## Step 2 — Install Maven (= pip)

**Maven** is the build tool and package manager for Java. It reads `pom.xml` and downloads dependencies from Maven Central (equivalent of PyPI).

### macOS
```bash
brew install maven
```

### Windows
```bash
winget install Apache.Maven
```

### Verify
```bash
mvn -version
# Apache Maven 3.x.x
```

> **Note:** In this project we use the **Maven Wrapper** (`mvnw`) — a script committed to the repo that downloads the correct Maven version automatically. This means teammates don't need Maven installed at all. It's like committing a `pip` binary into the repo. When you see `./mvnw` in commands, that's the wrapper.

---

## Step 3 — Generate a New Project (= `django-admin startproject`)

Django gives you `django-admin startproject`. Spring Boot gives you **Spring Initializr**, a web UI that generates the project scaffold.

### Go to: https://start.spring.io

Fill in the form exactly as this project was configured:

| Field | Value |
|---|---|
| **Project** | Maven |
| **Language** | Java |
| **Spring Boot** | 3.4.4 |
| **Group** | `com.silverguide` |
| **Artifact** | `backend` |
| **Packaging** | Jar |
| **Java** | 21 |

Then click **Add Dependencies** and add:
- `Spring Web` — HTTP server + REST (= `djangorestframework`)
- `Spring Security` — auth framework (= `django.contrib.auth`)
- `Spring Data JPA` — ORM (= Django ORM)
- `Validation` — Bean Validation (= DRF serializer validators)
- `MySQL Driver` — database connector (= `mysqlclient`)
- `Lombok` — boilerplate code generator (no Django equivalent)

Click **Generate** → downloads a `.zip`.
Unzip it → this becomes your `backend/` folder.

### What gets generated

```
backend/
  src/
    main/
      java/com/silverguide/backend/
        SilverGuideApplication.java     ← manage.py equivalent
      resources/
        application.properties          ← settings.py equivalent
    test/
      java/com/silverguide/backend/
        SilverGuideApplicationTests.java
  .mvn/                                 ← Maven wrapper files
  mvnw                                  ← Maven wrapper script (macOS/Linux)
  mvnw.cmd                              ← Maven wrapper script (Windows)
  pom.xml                               ← requirements.txt + build config
```

---

## Step 4 — Understanding `pom.xml` (= `requirements.txt` + build config)

In Django you have `requirements.txt`:
```
django==4.2
djangorestframework==3.15
mysqlclient==2.2
```

In Spring Boot, `pom.xml` does the same job but also configures how the project is built:

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.4.4</version>   <!-- pins the Spring Boot version -->
</parent>

<properties>
    <java.version>21</java.version>
    <jjwt.version>0.12.6</jjwt.version>   <!-- define a version variable -->
</properties>

<dependencies>
    <!-- = pip install djangorestframework -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- = pip install mysqlclient -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>   <!-- only needed at runtime, not compile time -->
    </dependency>

    <!-- = pip install PyJWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>${jjwt.version}</version>
    </dependency>
</dependencies>
```

Notice most Spring Boot dependencies have **no version number** — they inherit the correct version from `spring-boot-starter-parent`. This is like if PyPI automatically ensured all Django packages used compatible versions.

### Adding a new dependency

In Django:
```bash
pip install Pillow
echo "Pillow==10.3" >> requirements.txt
```

In Spring Boot, you just add a block to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

Then run:
```bash
./mvnw dependency:resolve
```
Maven downloads it automatically. No separate install command needed — running the app also downloads missing dependencies.

---

## Step 5 — Add Extra Dependencies Manually

The Spring Initializr doesn't include JWT libraries. After generating the project, open `pom.xml` and add these inside `<dependencies>`:

```xml
<!-- JWT — 3 jars needed together -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

Save the file. Your IDE (IntelliJ) will automatically download the new packages — or run `./mvnw dependency:resolve` manually.

---

## Step 6 — Configure `application.properties` (= `settings.py`)

The generated file is mostly empty. Fill it in:

```properties
# Database (= DATABASES in settings.py)
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:silverguide}?useSSL=false&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME:sguser}
spring.datasource.password=${DB_PASSWORD:sgpassword}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ORM (= DATABASES ENGINE + migrations)
spring.jpa.hibernate.ddl-auto=update          # auto-create/alter tables (dev only)
spring.jpa.show-sql=false                     # log SQL queries (set true to debug)
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Custom app settings
app.jwt.secret=${JWT_SECRET:some-64-char-key}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:5500}

# Server port (= manage.py runserver 8080)
server.port=8080
```

---

## Step 7 — Write the Entry Point (auto-generated)

This was already generated by Spring Initializr. You never need to touch it:

```java
// SilverGuideApplication.java
@SpringBootApplication   // = everything: INSTALLED_APPS scanning, auto-config, component scan
public class SilverGuideApplication {
    public static void main(String[] args) {
        SpringApplication.run(SilverGuideApplication.class, args);
    }
}
```

Django equivalent:
```python
# manage.py — you also never touch this
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
execute_from_command_line(sys.argv)
```

`@SpringBootApplication` is a single annotation that enables:
- **Component scanning** — finds all `@Service`, `@Repository`, `@Controller` classes automatically (= `INSTALLED_APPS`)
- **Auto-configuration** — detects MySQL driver on classpath and auto-configures the connection pool
- **`@Configuration`** — the class itself can define beans

---

## Step 8 — Run the App

### Without Docker (local development)

```bash
# Start MySQL first (however you have it running)

# Then run Spring Boot
./mvnw spring-boot:run
```

This is the equivalent of `python manage.py runserver`.
The first run downloads all dependencies (~200MB). Subsequent runs are fast.

Spring Boot prints the familiar banner and starts Tomcat:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
...
Tomcat started on port 8080
Started SilverGuideApplication in 3.2 seconds
```

### Build a JAR (= creating a distributable)

Django doesn't have a build step — you deploy the source code directly.
Spring Boot compiles everything into a single self-contained JAR file:

```bash
./mvnw package -DskipTests
# produces: target/backend-0.0.1-SNAPSHOT.jar
```

Run the JAR anywhere Java is installed:
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

No Python, no pip, no virtual environment needed on the server — just Java.

### With Docker (this project)

```bash
docker-compose up --build   # first time
docker-compose up           # subsequent runs (no code changes)
docker-compose up --build backend   # after changing Java code
```

The Dockerfile does two things:
1. **Builder stage** — uses JDK 21 Alpine to compile the source into a JAR (`./mvnw package`)
2. **Runtime stage** — uses JRE 21 Alpine (smaller, no compiler) to run `java -jar app.jar`

```dockerfile
# Stage 1: compile
FROM eclipse-temurin:21-jdk-alpine AS builder
RUN ./mvnw package -DskipTests -B

# Stage 2: run (smaller image, no compiler)
FROM eclipse-temurin:21-jre-alpine
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Django equivalent would be: compile `.py` files to `.pyc`, then ship only the `.pyc`. In practice Django doesn't do this — Spring Boot's compiled JAR is a key advantage for deployment.

---

## Step 9 — Recommended IDE: IntelliJ IDEA

| Django | Spring Boot |
|---|---|
| VS Code + Python extension | IntelliJ IDEA (Community is free) |
| PyCharm | IntelliJ IDEA Ultimate (paid, best Spring support) |

IntelliJ understands `pom.xml` natively:
- Auto-downloads dependencies when you save `pom.xml`
- Generates Lombok boilerplate in the background
- Shows you Spring Boot configuration hints in `application.properties`
- Has a built-in HTTP client to test your API endpoints

### Install the Lombok plugin
IntelliJ needs a plugin to understand Lombok annotations:
`Settings → Plugins → search "Lombok" → Install`

Also enable annotation processing:
`Settings → Build → Compiler → Annotation Processors → Enable annotation processing`

Without this, all the `@Data` / `@Builder` classes will show red errors even though the code is correct.

---

## Full Setup Checklist

```
☐ Install Java 21 JDK (Temurin)     java -version
☐ Install Maven (optional if using mvnw)
☐ Go to start.spring.io
☐ Select: Maven, Java 21, Spring Boot 3.4.4
☐ Add dependencies: Web, Security, Data JPA, Validation, MySQL Driver, Lombok
☐ Generate → unzip
☐ Open in IntelliJ → install Lombok plugin
☐ Add JWT dependencies to pom.xml manually
☐ Fill in application.properties
☐ Create .env (for Docker) or set environment variables
☐ ./mvnw spring-boot:run   (or docker-compose up --build)
```

---

## Side-by-side: Django vs Spring Boot project creation

```
Django                                  Spring Boot
──────────────────────────────────────  ──────────────────────────────────────
1. brew install python@3.12             brew install --cask temurin@21
2. python -m venv venv                  (not needed — Maven isolates per project)
3. source venv/bin/activate             (not needed)
4. pip install django                   (done at generate step)
   pip install djangorestframework
   pip install mysqlclient
5. django-admin startproject myproject  go to start.spring.io → Generate
6. cd myproject                         unzip → open in IntelliJ
7. python manage.py startapp myapp      create a Java package (no CLI needed)
8. edit settings.py                     edit application.properties
9. python manage.py makemigrations      (not needed — ddl-auto=update handles it)
   python manage.py migrate
10. python manage.py runserver          ./mvnw spring-boot:run
```
