/**
 * =========================================================================
 * ملف بيانات وتفاصيل دعوة الخطوبة (بيانات العروسين زين ومريم)
 * INVITATION CONFIGURATION FILE
 * =========================================================================
 * يمكنك تغيير أي صورة بكل سهولة إما:
 * 1) استبدال ملف الصورة مباشرة في مجلد public (مثل: couple.jpg أو children.png أو gallery2.jpg أو gallery3.jpg)
 * 2) أو تعديل المسار هنا في هذا الملف مباشرة.
 * =========================================================================
 */

export const INVITATION_DATA = {
  // =========================================================================
  // 📸 قسم الصور (جميع الصور موجودة في مجلد public ويمكن استبدالها وتغييرها بسهولة)
  // =========================================================================
  images: {
    // 1. صورة العروسين الرئيسية (الصورة 1 في معرض الصور)
    couple: "/couple.jpg",

    // 2. صور معرض الصور الإضافية (الصورة 2 و 3)
    gallery1: "/couple.jpg",
    gallery2: "/gallery_rings.jpg",
    gallery3: "/gallery_sunset.jpg",

    // 3. صورة الأطفال في أسفل الدعوة
    children: "/children.png",

    // 4. صورة الظرف الملكي (شاشة البداية)
    envelope: "/envelope.png",

    // 5. صورة الستارة المخملية (أعلى البطاقة)
    curtain: "/curtain.png",

    // 6. صورة باقة الورد (أعلى اليمين)
    bouquet: "/bouquet.png",

    // 7. صورة الحمامة الطائرة
    dove: "/dove.png",
  },

  // ترويسة الغلاف والظرف
  envelopeHeader: "We're getting engaged",

  // الاسمان بالخط الإنجليزي المائل (مثل الصورة المرجعية تماماً)
  scriptNames: "Zain & Mariam",

  // ترويسة الدعوة
  headerTitleEn: "THE engagement OF OUR CHILDREN",
  headerTitleAr: "حفل خطوبة مبارك",

  // بيانات العريس
  groom: {
    name: "Zain",
    nameAr: "زين",
    subtitle: "GROOM"
  },

  // بيانات العروس
  bride: {
    name: "Mariam",
    nameAr: "مريم",
    subtitle: "BRIDE"
  },

  // عبارة الدعوة الترحيبية بالإنجليزية
  welcomeMessage: "We would love to have you with us as we celebrate the beginning of our forever.",

  // معرض الصور (3 صور مع العنوان PHOTO GALLERY)
  gallery: {
    title: "PHOTO GALLERY",
    photos: [
      { id: 1, src: "/couple.jpg", fallback: "/gallery1.jpg", alt: "صورة العروسين الملكية" },
      { id: 2, src: "/gallery_rings.jpg", fallback: "/gallery2.jpg", alt: "دبل وخواتم الخطوبة" },
      { id: 3, src: "/gallery_sunset.jpg", fallback: "/gallery3.jpg", alt: "لحظات رومانسية عند الغروب" },
    ],
    photoMainPortrait: "/couple.jpg",
  },

  // تفاصيل الموعد والوقت (العد التنازلي)
  schedule: {
    headingEn: "THE ENGAGEMENT PARTY WILL TAKE PLACE AT:",
    timeDisplay: "3:00 PM",
    dateDayName: "MONDAY",
    dateDayNameAr: "الإثنين",
    dateDayNumber: "2",
    dateMonthYear: "NOVEMBER 2026",
    dateMonthYearAr: "نوفمبر ٢٠٢٦",
    // تاريخ ووقت الحفل لحساب العد التنازلي: 2 نوفمبر 2026 الساعة 3:00 عصراً
    targetDateTime: "2026-11-02T15:00:00"
  },

  // تفاصيل المكان وخريطة Google Maps
  location: {
    title: "LOCATION",
    venueName: "Sea View",
    venueNameAr: "قاعة سي فيو",
    address: "around miami bridge",
    addressAr: "أسفل كوبري رأس البر",
    // رابط خريطة Google Maps المرسل من المستخدم
    googleMapsUrl: "https://maps.app.goo.gl/58kDcnwkhhNWUB8e9?g_st=iw",
    // تضمين خريطة Google Maps
    mapEmbedIframe: "https://maps.google.com/maps?q=Ras+El+Bar+Bridge+Damietta&t=&z=15&ie=UTF8&iwloc=&output=embed"
  },

  // دريس كود الحفل وألوان الملابس المقترحة
  dressCode: {
    title: "DRESS CODE",
    subtitle: "WE WOULD LOVE TO SEE YOU IN SHADES OF:",
    colors: [
      { id: 1, name: "Pink", nameAr: "بينك", hex: "#E5989B" },
      { id: 2, name: "Olive", nameAr: "زيتي", hex: "#606C38" },
      { id: 3, name: "Mauve", nameAr: "موف", hex: "#9A7B9A" },
      { id: 4, name: "Yellow", nameAr: "أصفر", hex: "#F3D068" },
    ]
  },

  // تأكيد الحضور ورسائل التهنئة للعروسين (RSVP)
  rsvp: {
    title: "RSVP",
    subtitle: "PLEASE CONFIRM YOUR ATTENDANCE",
    namePlaceholder: "Name",
    messagePlaceholder: "Leave a message for Zain & Mariam...",
    submitText: "SEND RSVP",
    successHeading: "THANK YOU!",
    successMessage: "Your message has been received with love for Zain & Mariam ❤️"
  },

  // مسار ملف الموسيقى الرومانسية
  audioTrack: "/song.mp3"
};

