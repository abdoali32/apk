// يا سلام لو ركزت هنا، ده الملف الرئيسي اللي بيشغل كل التطبيق
import React, { useEffect } from 'react'
import { Provider } from 'react-redux';
import { persistor, store } from '$redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import RootNavigator from '$navigation/RootNavigator';

// لو عايز تشغل صوت بنت كل ما التطبيق يفتح، بص على الكود اللي تحت
import * as Speech from 'expo-speech';

const App = () => {
  useEffect(() => {
    // أول ما التطبيق يفتح، هتسمع صوت بنت بتقول الجملة دي باللهجة المصرية
    Speech.speak('أهلاً بيك في نادي الألعاب! يلا نلعب ونعمل جو!', { language: 'ar-EG' });
  }, []);

  return (
    // هنا بنوصل كل حاجة بالستور بتاع ريدكس عشان التطبيق كله يشتغل صح
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* هنا بنعرض النافيجيشن الأساسي اللي هيودي المستخدم بين الشاشات */}
        <RootNavigator />
      </PersistGate>
    </Provider>
  )
}

export default App