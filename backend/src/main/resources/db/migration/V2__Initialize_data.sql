-- Insert Topics
INSERT INTO topics (topic_name, description)
VALUES 
('Technology Basics', 'Essential guides to help you navigate digital tools and devices with confidence.'),
('Scam Awareness', 'Learn how to identify common online threats and protect your personal information.');


-- Admin user                                                                                                                                          
  INSERT INTO users (id, name, email, password, is_superuser, is_staff)                                                                                  
  VALUES (                                                                                                                                               
      UUID(),                                                                                                                                            
      'Admin',                                                                                                                                           
      'admin@example.com',
      '$2a$10$ALDaHxHk8KlIHlzoKqHum.sdJgfQxqnmNiQtcYBVhQrhpNtedPIB6',
      1,
      1
  );

-- Sample articles: topic_id 1 = Technology Basics, topic_id 2 = Scam Awareness
-- user_id is NULL (seed data, no author)

INSERT INTO articles (title, subtitle, description, content, img_url, user_id, topic_id) VALUES

-- ─── SCAM AWARENESS (topic_id = 2) ───────────────────────────────────────────

(
  'How to Spot a Phone Scam',
  'Real calls from banks and government agencies never ask for your PIN',
  'Learn the warning signs of common phone scams and how to protect yourself.',
  '{"time":1714000000000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"Phone scams are one of the most common ways fraudsters try to steal money from people. They often pretend to be your bank, the tax office, or even a family member in trouble."}},{"type":"header","data":{"text":"Warning Signs to Watch For","level":2}},{"type":"list","data":{"style":"unordered","items":["The caller asks for your PIN, password, or full bank card number","You are told to act immediately or something bad will happen","The caller asks you to buy gift cards and read out the numbers","You are asked to keep the call secret from family or friends"]}},{"type":"paragraph","data":{"text":"Legitimate organisations will never ask for your full PIN or password over the phone. If you feel pressured, hang up and call the organisation back using a number from their official website."}},{"type":"warning","data":{"title":"If in doubt, hang up","message":"You can always call back on a number you trust. A genuine caller will never object to this."}}]}',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
  NULL, 2
),

(
  'How to Recognise a Phishing Email',
  'Scammers send fake emails that look real — here is how to tell the difference',
  'Phishing emails trick you into clicking dangerous links or giving away personal details.',
  '{"time":1714000001000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"A phishing email is a fake message designed to look like it came from a trusted source — your bank, a delivery company, or even the government. The goal is to trick you into clicking a link or entering your personal details."}},{"type":"header","data":{"text":"How to Check an Email","level":2}},{"type":"list","data":{"style":"unordered","items":["Look at the sender''s email address carefully — scammers use addresses like ''support@amaz0n-help.com''","Hover over any link before clicking to see where it actually leads","Check for spelling mistakes and poor grammar","Real companies will never ask for your password by email"]}},{"type":"quote","data":{"text":"When in doubt, do not click. Go directly to the website by typing the address yourself.","caption":"Golden rule of email safety"}},{"type":"paragraph","data":{"text":"If you receive a suspicious email, do not reply or click any links. Forward it to your email provider''s spam reporting address and then delete it."}}]}',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
  NULL, 2
),

(
  'The Grandparent Scam Explained',
  'Fraudsters pretend to be a grandchild in trouble to steal money',
  'One of the most emotionally manipulative scams targets grandparents by faking a family emergency.',
  '{"time":1714000002000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"In the grandparent scam, someone calls pretending to be your grandchild — or a lawyer or police officer acting on their behalf. They claim there has been an accident or an arrest and that they urgently need money."}},{"type":"header","data":{"text":"How the Scam Works","level":2}},{"type":"list","data":{"style":"ordered","items":["You receive a call from someone claiming to be your grandchild in an emergency","They ask you to wire money or send gift cards immediately","They beg you not to tell other family members","Once the money is sent, it cannot be recovered"]}},{"type":"warning","data":{"title":"Always verify before sending money","message":"Hang up and call your grandchild or their parent directly on a number you already know. A real emergency will still be a real emergency five minutes later."}},{"type":"paragraph","data":{"text":"If you have already sent money, contact your bank immediately and report it to your local police. You are not alone — this scam happens thousands of times every year."}}]}',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
  NULL, 2
),

(
  'Online Shopping Scams: How to Buy Safely',
  'Not every online shop is legitimate — learn how to spot the fakes',
  'Fake online shops look convincing but disappear after taking your money.',
  '{"time":1714000003000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"Shopping online is convenient, but not every website selling products is genuine. Fake shops are designed to look professional and often advertise items at very low prices to attract buyers."}},{"type":"header","data":{"text":"Before You Buy, Check These","level":2}},{"type":"list","data":{"style":"unordered","items":["Look for a padlock icon in the browser address bar","Search for reviews of the shop on Google before purchasing","Be suspicious of prices that seem too good to be true","Check that the website has a real contact address and phone number","Pay by credit card where possible — it offers more protection than debit card"]}},{"type":"paragraph","data":{"text":"Stick to well-known retailers or marketplaces you have used before. If you discover a website is a scam after purchasing, contact your bank immediately to dispute the charge."}}]}',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
  NULL, 2
),

(
  'Romance Scams: Protecting Your Heart and Your Money',
  'Online relationships can be fake — scammers use emotion to steal thousands',
  'Romance scammers build trust over weeks before asking for money.',
  '{"time":1714000004000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"Romance scams happen when someone creates a fake profile on a dating site or social media and builds a relationship with you over time. Once trust is established, they invent a crisis and ask for money."}},{"type":"header","data":{"text":"Common Warning Signs","level":2}},{"type":"list","data":{"style":"unordered","items":["They claim to live abroad or work overseas (often as a soldier or doctor)","They never agree to a video call or always have an excuse","The relationship moves very quickly and they express strong feelings early","They eventually ask for money for an emergency, travel costs, or medical bills"]}},{"type":"quote","data":{"text":"Never send money to someone you have not met in person, no matter how real the relationship feels.","caption":""}},{"type":"paragraph","data":{"text":"If you suspect a romance scam, stop all contact and report it to the platform where you met them. Talk to someone you trust — there is no shame in being targeted, these scammers are very skilled."}}]}',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
  NULL, 2
),

-- ─── TECHNOLOGY BASICS (topic_id = 1) ────────────────────────────────────────

(
  'Getting Started with Your Smartphone',
  'A simple guide to the basics every new smartphone user should know',
  'Smartphones can feel overwhelming at first. This guide walks you through the essentials.',
  '{"time":1714000005000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"A smartphone is a mobile phone that can connect to the internet, take photos, send messages, and run apps. If you are new to smartphones, this guide will help you get comfortable with the basics."}},{"type":"header","data":{"text":"The Most Important Buttons","level":2}},{"type":"list","data":{"style":"unordered","items":["Power button — turns the screen on and off; hold it down to restart or shut down","Volume buttons — on the side, control how loud sounds are","Home button — takes you back to the main screen (on some phones this is a swipe gesture)"]}},{"type":"header","data":{"text":"Key Things to Set Up First","level":2}},{"type":"list","data":{"style":"ordered","items":["Set a PIN or fingerprint lock to keep your phone secure","Connect to your home Wi-Fi to avoid using up mobile data","Add an emergency contact in your phone''s settings"]}},{"type":"paragraph","data":{"text":"Do not worry about learning everything at once. Start with calls, messages, and photos — those are the three things most people use most. Everything else can come later."}}]}',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
  NULL, 1
),

(
  'How to Create a Strong Password',
  'A good password is your first line of defence online',
  'Weak passwords are one of the most common reasons accounts get hacked.',
  '{"time":1714000006000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"A password protects your online accounts the same way a lock protects your front door. A weak password is like a lock that can be picked in seconds — a strong one is much harder to break."}},{"type":"header","data":{"text":"What Makes a Password Strong","level":2}},{"type":"list","data":{"style":"unordered","items":["At least 12 characters long","A mix of uppercase and lowercase letters, numbers, and symbols","Not a word from the dictionary","Not your name, birthday, or address"]}},{"type":"header","data":{"text":"A Simple Trick: Use a Passphrase","level":2}},{"type":"paragraph","data":{"text":"Instead of a single word, think of three or four random words joined together, like ''PurpleChairRainbow7!''. It is long, easy to remember, and very hard to guess."}},{"type":"warning","data":{"title":"Never reuse passwords","message":"If you use the same password everywhere and one account is hacked, all your accounts become vulnerable. Use a different password for each important account."}},{"type":"paragraph","data":{"text":"Consider using a password manager app — it remembers all your passwords securely so you only need to remember one master password."}}]}',
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800',
  NULL, 1
),

(
  'Understanding Wi-Fi: What It Is and How to Stay Safe',
  'Wi-Fi connects you to the internet wirelessly — but not all networks are safe',
  'Knowing the difference between safe and unsafe Wi-Fi can protect your personal information.',
  '{"time":1714000007000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"Wi-Fi is a way of connecting to the internet without a cable. Your home router broadcasts a Wi-Fi signal that your phone, tablet, or computer can connect to."}},{"type":"header","data":{"text":"Home Wi-Fi vs Public Wi-Fi","level":2}},{"type":"list","data":{"style":"unordered","items":["Your home Wi-Fi is private and protected by a password — safe for banking and shopping","Public Wi-Fi in cafes or airports is shared with strangers — avoid logging into sensitive accounts on it","If you must use public Wi-Fi, do not do online banking or enter passwords"]}},{"type":"header","data":{"text":"Keeping Your Home Wi-Fi Secure","level":2}},{"type":"list","data":{"style":"ordered","items":["Change the default password on your router — the manual shows you how","Use WPA2 or WPA3 security (shown in your router settings)","Do not share your Wi-Fi password with people you do not know well"]}},{"type":"paragraph","data":{"text":"Your internet provider can help you set up your router securely if you are unsure. Most offer free support by phone."}}]}',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
  NULL, 1
),

(
  'How to Make a Video Call',
  'Stay connected with family and friends face-to-face no matter the distance',
  'Video calling is easier than you think. This guide covers the most popular apps.',
  '{"time":1714000008000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"A video call lets you see and hear the person you are speaking to, just like being in the same room. All you need is a smartphone, tablet, or computer with a camera."}},{"type":"header","data":{"text":"Popular Video Calling Apps","level":2}},{"type":"list","data":{"style":"unordered","items":["FaceTime — built into all iPhones and iPads, very simple to use","WhatsApp — works on both Apple and Android, free to download","Zoom — popular for group calls with multiple family members at once","Google Meet — works directly in a web browser, no app needed"]}},{"type":"header","data":{"text":"Starting Your First Call","level":2}},{"type":"list","data":{"style":"ordered","items":["Open the app and sign in (or ask a family member to help set it up)","Find the person''s name in your contacts","Tap the video camera icon to start a video call","Make sure your camera is facing you and the room is well lit"]}},{"type":"paragraph","data":{"text":"If the call drops or the picture is blurry, move closer to your Wi-Fi router. A stronger connection makes a big difference to call quality."}}]}',
  'https://images.unsplash.com/photo-1587560699334-bea93391dcef?w=800',
  NULL, 1
),

(
  'What Are App Permissions and Why Do They Matter',
  'Apps ask for access to your camera, location, and contacts — here is when to say no',
  'Understanding app permissions helps you stay in control of your personal data.',
  '{"time":1714000009000,"version":"2.28.2","blocks":[{"type":"paragraph","data":{"text":"When you install a new app, it often asks for permission to access parts of your phone — your camera, microphone, location, or contacts. These requests are called permissions."}},{"type":"header","data":{"text":"Common Permissions Explained","level":2}},{"type":"list","data":{"style":"unordered","items":["Camera — allows the app to take photos or record video","Microphone — allows the app to record audio","Location — allows the app to see where you are","Contacts — allows the app to see names and numbers in your address book","Storage — allows the app to save or read files on your phone"]}},{"type":"header","data":{"text":"When to Say No","level":2}},{"type":"paragraph","data":{"text":"Ask yourself: does this app really need this access? A torch app has no reason to access your contacts. A maps app needs your location but not your microphone."}},{"type":"list","data":{"style":"unordered","items":["Only grant permissions that make sense for what the app does","You can review and remove permissions at any time in your phone''s Settings","If an app demands a permission that seems unnecessary, consider not installing it"]}},{"type":"warning","data":{"title":"You are always in control","message":"Granting a permission is not permanent. Go to Settings and then Apps to adjust what any app can access at any time."}}]}',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
  NULL, 1
);
