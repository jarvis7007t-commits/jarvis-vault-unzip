import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.newChat': 'New Chat',
    'nav.settings': 'Settings',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Voice Interface
    'voice.tapToSpeak': 'TAP TO SPEAK',
    'voice.tapToStop': 'TAP TO STOP',
    'voice.processing': 'PROCESSING...',
    'voice.jarvisReady': 'Jarvis Ready',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your preferences',
    'settings.account': 'Account',
    'settings.email': 'Email',
    'settings.status': 'Status',
    'settings.loggedIn': 'Logged In',
    'settings.appearance': 'Appearance',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select your preferred language',
    'settings.features': 'Features',
    'settings.voiceAssistant': 'Voice Assistant',
    'settings.voiceDesc': 'Give voice commands',
    'settings.news': 'News',
    'settings.newsDesc': 'Real-time news (2025)',
    'settings.search': 'Google Search',
    'settings.searchDesc': 'Real-time internet search',
    'settings.voice': 'Voice Settings',
    'settings.voiceModel': 'Voice Model',
    'settings.selectVoice': 'Select voice for responses',
    'settings.about': 'About AI',
    'settings.version': 'Version',
    'settings.data': 'Data',
    'settings.liveData': '2025 Live Data',
    'settings.capabilities': 'Capabilities',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signInWithEmail': 'Sign in with Email',
    'auth.signUpWithEmail': 'Sign up with Email',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    
    // Apps
    'apps.title': 'Saved Apps',
    'apps.add': 'Add New App',
    'apps.name': 'App Name',
    'apps.displayName': 'Display Name',
    'apps.url': 'URL/Phone/WhatsApp',
    'apps.save': 'Save App',
    'apps.cancel': 'Cancel',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  hi: {
    // Navigation
    'nav.newChat': 'नई चैट',
    'nav.settings': 'सेटिंग्स',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    
    // Voice Interface
    'voice.tapToSpeak': 'बोलने के लिए टैप करें',
    'voice.tapToStop': 'रोकने के लिए टैप करें',
    'voice.processing': 'प्रोसेसिंग...',
    'voice.jarvisReady': 'जार्विस तैयार',
    
    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.subtitle': 'अपनी प्राथमिकताएं प्रबंधित करें',
    'settings.account': 'अकाउंट',
    'settings.email': 'ईमेल',
    'settings.status': 'स्थिति',
    'settings.loggedIn': 'लॉगिन',
    'settings.appearance': 'दिखावट',
    'settings.darkMode': 'डार्क मोड',
    'settings.language': 'भाषा',
    'settings.selectLanguage': 'अपनी पसंदीदा भाषा चुनें',
    'settings.features': 'फीचर्स',
    'settings.voiceAssistant': 'वॉइस असिस्टेंट',
    'settings.voiceDesc': 'आवाज से कमांड दें',
    'settings.news': 'समाचार',
    'settings.newsDesc': 'रियल-टाइम न्यूज़ (2025)',
    'settings.search': 'गूगल सर्च',
    'settings.searchDesc': 'रियल-टाइम इंटरनेट सर्च',
    'settings.voice': 'वॉइस सेटिंग्स',
    'settings.voiceModel': 'वॉइस मॉडल',
    'settings.selectVoice': 'जवाब के लिए आवाज चुनें',
    'settings.about': 'एआई के बारे में',
    'settings.version': 'संस्करण',
    'settings.data': 'डेटा',
    'settings.liveData': '2025 का लाइव डेटा',
    'settings.capabilities': 'क्षमताएं',
    
    // Auth
    'auth.login': 'लॉगिन',
    'auth.signup': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.signInWithEmail': 'ईमेल से साइन इन करें',
    'auth.signUpWithEmail': 'ईमेल से साइन अप करें',
    'auth.noAccount': 'अकाउंट नहीं है?',
    'auth.haveAccount': 'पहले से अकाउंट है?',
    
    // Apps
    'apps.title': 'सेव किए गए ऐप्स',
    'apps.add': 'नया ऐप जोड़ें',
    'apps.name': 'ऐप का नाम',
    'apps.displayName': 'डिस्प्ले नाम',
    'apps.url': 'URL/फोन/व्हाट्सएप',
    'apps.save': 'ऐप सेव करें',
    'apps.cancel': 'रद्द करें',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'एरर',
    'common.success': 'सफल',
  },
  es: {
    'nav.newChat': 'Nuevo Chat',
    'nav.settings': 'Configuración',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'voice.tapToSpeak': 'TOCA PARA HABLAR',
    'voice.tapToStop': 'TOCA PARA DETENER',
    'voice.processing': 'PROCESANDO...',
    'voice.jarvisReady': 'Jarvis Listo',
    'settings.title': 'Configuración',
    'settings.subtitle': 'Administra tus preferencias',
    'settings.language': 'Idioma',
    'settings.selectLanguage': 'Selecciona tu idioma preferido',
  },
  fr: {
    'nav.newChat': 'Nouveau Chat',
    'nav.settings': 'Paramètres',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'voice.tapToSpeak': 'APPUYEZ POUR PARLER',
    'voice.tapToStop': 'APPUYEZ POUR ARRÊTER',
    'voice.processing': 'TRAITEMENT...',
    'voice.jarvisReady': 'Jarvis Prêt',
    'settings.title': 'Paramètres',
    'settings.subtitle': 'Gérez vos préférences',
    'settings.language': 'Langue',
    'settings.selectLanguage': 'Sélectionnez votre langue préférée',
  },
  de: {
    'nav.newChat': 'Neuer Chat',
    'nav.settings': 'Einstellungen',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    'voice.tapToSpeak': 'TIPPEN ZUM SPRECHEN',
    'voice.tapToStop': 'TIPPEN ZUM STOPPEN',
    'voice.processing': 'VERARBEITUNG...',
    'voice.jarvisReady': 'Jarvis Bereit',
    'settings.title': 'Einstellungen',
    'settings.subtitle': 'Verwalten Sie Ihre Einstellungen',
    'settings.language': 'Sprache',
    'settings.selectLanguage': 'Wählen Sie Ihre bevorzugte Sprache',
  },
  zh: {
    'nav.newChat': '新聊天',
    'nav.settings': '设置',
    'nav.login': '登录',
    'nav.logout': '登出',
    'voice.tapToSpeak': '点击说话',
    'voice.tapToStop': '点击停止',
    'voice.processing': '处理中...',
    'voice.jarvisReady': 'Jarvis 准备好了',
    'settings.title': '设置',
    'settings.subtitle': '管理您的偏好',
    'settings.language': '语言',
    'settings.selectLanguage': '选择您的首选语言',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'hi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
