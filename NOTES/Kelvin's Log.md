Kelvin's configuration changes for capstone project:

------------------------------------------------------------------------------------

backend/src/resources/application.properties

spring.jpa.hibernate.ddl-auto=validate -> spring.jpa.hibernate.ddl-auto=update

------------------------------------------------------------------------------------

root folder and chatbot .env file

Changed
CORS_ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,http://127.0.0.1:3000
to
CORS_ALLOWED_ORIGINS=http://localhost:5174,http://127.0.0.1:5174

CRLF -> LF  //Bottom right of screen

------------------------------------------------------------------------------------

4/6 Added back i18n mini feature with the following features:

Global i18n (static files)
-Languages: English (default), Simplified Chinese (中文), Malay (Melayu), Tamil (தமிழ்)
-Persistence: localStorage key silverguide-language
-Files: frontend/app/i18n/ (types, context, and translations/en|zh|ms|ta.ts)

Floating language toolbar
-Fixed top-right, above the navbar (z-index: 1050)
-Styled to match the site: #f8f9fa background, dark border, lime #dfff6f active state, pill shape
-Hides while scrolling; reappears when the cursor enters the top-right hover zone
-Hidden on /admin/* and /editor (staff-only routes)
-Visible on all other public routes (articles/tutorials stay in English for content)

Translated UI
Area	                      Translated
Navbar & footer               Yes (global)
Home                          Fixed UI only 
About                         Full page including team names, roles, bios
Emergency                     Instructions only; bank names & phone numbers unchanged
Login & register              Forms + validation/error messages
Articles / AI tutorial        Content not translated (toolbar still available)
/ article pages              

9/6 Merged part of ek hong's accessibility interface(retained theme) and my translation system