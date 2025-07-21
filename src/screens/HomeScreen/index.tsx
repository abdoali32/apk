// الشاشة الرئيسية بتاعة نادي الألعاب
import { Animated, Text, Image, Alert, Pressable } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import Wrapper from '$components/Wrapper'
import { IMAGES } from '$assets/images'
import { styles } from './styles'
import GradientButton from '$components/GradientButton'
import { useAppDispatch } from '$hooks/useAppStore'
import { resetGame } from '$redux/reducers/gameSlice'
import { playSound, stopSound } from '$helpers/SoundUtils'
import { useSelector } from 'react-redux'
import { selectCurrentPosition } from '$redux/reducers/gameSelectors'
import { useIsFocused } from '@react-navigation/native'
import { navigate } from '$helpers/navigationUtils'
import LottieView from 'lottie-react-native'
import { ANIMATATIONS } from '$assets/animation'
import { DEVICE_WIDTH } from '$constants/dimensions'

// هنا البنت هترحب بيك أول ما تفتح الشاشة
const HomeScreen = () => {

  const dispatch = useAppDispatch();
  const currentPosition = useSelector(selectCurrentPosition);
  const isFocused = useIsFocused();

  const withAnim = useRef(new Animated.Value(-DEVICE_WIDTH)).current;
  const scaleXAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    if (isFocused) {
      // هنا ممكن صوت بنت تقول "أهلاً بيك في نادي الألعاب! يلا نبدأ؟"
      playSound('home')
    }
  }, [isFocused])

  useEffect(() => {

    // دي حركة الانيميشن بتاعة الساحرة وهي ماشية بتلف في الشاشة
    const loopAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(withAnim, {
              toValue: DEVICE_WIDTH * 0.02,
              duration: 2000,
              useNativeDriver: true
            }),
            Animated.timing(scaleXAnim, {
              toValue: -1,
              duration: 2000,
              useNativeDriver: true
            })
          ]),

          Animated.delay(3000),

          Animated.parallel([
            Animated.timing(withAnim, {
              toValue: DEVICE_WIDTH * 2,
              duration: 8000,
              useNativeDriver: true
            }),
            Animated.timing(scaleXAnim, {
              toValue: -1,
              duration: 0,
              useNativeDriver: true
            })
          ]),

          Animated.parallel([
            Animated.timing(withAnim, {
              toValue: -DEVICE_WIDTH * 0.05,
              duration: 3000,
              useNativeDriver: true
            }),
            Animated.timing(scaleXAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            })
          ]),

          Animated.delay(3000),

          Animated.parallel([
            Animated.timing(withAnim, {
              toValue: -DEVICE_WIDTH * 2,
              duration: 8000,
              useNativeDriver: true
            }),
            Animated.timing(scaleXAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            })
          ]),
        ])
      ).start();
    }

    const cleanUpAnimation = () => {
      Animated.timing(withAnim).stop();
      Animated.timing(scaleXAnim).stop();
    }

    loopAnimation();

    return cleanUpAnimation;
  }, [withAnim, scaleXAnim])

  // هنا بنرندر زرار بلون متدرج بالنص اللي احنا عايزينه
  const renderButton = useCallback((title: string, onPress: () => void) => {
    return (
      <GradientButton
        title={title}
        onPress={onPress}
      />
    )
  }, [])

  // هنا لما المستخدم يضغط يبدأ لعبة جديدة أو يكمل لعبته القديمة
  const startGame = async (e: boolean = false) => {
    stopSound();
    if (e) {
      dispatch(resetGame());
    }
    navigate('LudoBoardScreen', {});
    playSound('game_start');
  };

  // لما يضغط على "لعبة جديدة"
  const handleNewGame = useCallback(() => {
    startGame(true)
  }, []);

  // لما يضغط على "كمّل لعب"
  const handleResumeGame = useCallback(() => {
    startGame(false);
  }, []);

  // لما يضغط على زرار لسه مش شغال
  const handleCoomingSoon = useCallback(() => {
    // هنا ممكن البنت تقول: "الميزة دي جاية قريب، استنى علينا شوية!"
    Alert.alert('الميزة دي جاية قريب')
  }, []);

  return (
    <Wrapper style={{ justifyContent: 'flex-start' }}>
      {/* لوجو نادي الألعاب */}
      <Animated.View style={styles.imgContainer}>
        <Image
          source={IMAGES.Logo}
          style={styles.img}
          resizeMode={'contain'}
        />
      </Animated.View>

      {/* لو فيه لعبة قديمة ممكن تكملها */}
      {currentPosition.length !== 0 && renderButton("كمّل اللعب", handleResumeGame)}
      {renderButton("لعبة جديدة", handleNewGame)}
      {renderButton("ضد الكمبيوتر", handleCoomingSoon)}
      {renderButton("اتنين ضد اتنين", handleCoomingSoon)}

      {/* الساحرة لسه عاملة جو في الشاشة، دوس عليها واسمع صوت! */}
      <Animated.View
        style={[
          styles.witchContainer,
          { transform: [{ translateX: withAnim }, { scaleX: scaleXAnim }] },
        ]}
      >
        <Pressable
          onPress={() => {
            // لما تدوس على الساحرة، هتسمع صوت بنت بتضحك أو تعلق
            const soundName: any = `sound_girl${Math.floor(Math.random() * 4)}`;
            playSound(soundName);
            // مثال: "إيه يا نجم! الساحرة معاك في الجو"
          }}
        >
          <LottieView
            hardwareAccelerationAndroid
            source={ANIMATATIONS.Witch}
            autoPlay
            loop
            speed={1}
            style={styles.witch}
          />
        </Pressable>
      </Animated.View>

      {/* دي جملة بتظهر تحت، ممكن نغيرها لو حابب */}
      <Text style={styles.labelStyle}>صُنع بحب - نادي الألعاب</Text>
    </Wrapper>
  )
}

export default HomeScreen