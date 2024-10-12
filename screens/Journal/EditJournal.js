import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    TextInput,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ImageBackground, Animated, Modal, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const EditJournal = ({ route, navigation }) => {
    const { journal } = route.params; 
    const [image1, setImage1] = useState(null); 
    const [image2, setImage2] = useState(null); 
    const [image3, setImage3] = useState(null); 
    const [coverImg, setCoverImg] = useState(null);
    const [journalTitle, setJournalTitle] = useState('');
    const [template, setTemplate] = useState('');
    const [journalText, setJournalText] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const [privacyModalVisible, setPrivacyModalVisible] = useState(false); 
    const [privacyOption, setPrivacyOption] = useState('Public');
    const [typingAnimation, setTypingAnimation] = useState(new Animated.Value(0)); 
    const loadingText = "Hold on! Recording your journey."; 
    const [todayDate, setTodayDate] = useState('');

    useEffect(() => {
        if (journal) {
            setJournalTitle(journal.journalTitle || '');
            setJournalText(journal.journalText || '');
            setCoverImg(journal.coverImg || null);
            setImage1(journal.image1 || null);
            setImage2(journal.image2 || null);
            setImage3(journal.image3 || null);
            setTodayDate(journal.createdAt || null);
            setTemplate(journal.template || '');
        }

        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long',    
            day: 'numeric',   
        });
        setTodayDate(formattedDate);
    }, [journal]);

    const pickImage = async (setImage) => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error picking image:', error);
        }
    };

    const uploadImage = async (imageUri, imageName) => {
        if (!imageUri) return null;

        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const storage = getStorage();
            const storageRef = ref(storage, `journals/${imageName}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.log('Error uploading image:', error);
            return null;
        }
    };

    const handleSave = async () => {
        if (!journalText.trim() || !journalTitle.trim()) {
            Alert.alert('Error', 'Please provide a title and write your journal.');
            return;
        }

        setPrivacyModalVisible(true); 
    };

    const saveJournalWithPrivacy = async (selectedPrivacy) => {

        setLoading(true);
        startTypingAnimation();
        setPrivacyModalVisible(false); 

        try {
            const image1Url = await uploadImage(image1, `image1-${Date.now()}.jpg`);
            const image2Url = await uploadImage(image2, `image2-${Date.now()}.jpg`);
            let image3Url = null;

            if (template === '02') {
                image3Url = await uploadImage(image3, `image3-${Date.now()}.jpg`);
            }

            const coverImgUrl = await uploadImage(coverImg, `coverImg-${Date.now()}.jpg`);

            const journalRef = doc(db, 'journals', journal.id);

            await updateDoc(journalRef, {
                journalText: journalText.trim(),
                journalTitle: journalTitle.trim(),
                image1: image1Url || journal.image1,
                image2: image2Url || journal.image2,
                ...(template === '02' && { image3: image3Url || journal.image3 }),
                coverImg: coverImgUrl || journal.coverImg,
                template: journal.template || 'default', 
                createdAt: journal.createdAt || new Date().toISOString(), 
            });

            Alert.alert('Perfect!', 'Your memories are stored.');

            navigation.navigate('JournalDetails', {
                journal: {
                    ...journal,
                    journalTitle,
                    journalText,
                    image1: image1Url || journal.image1,
                    image2: image2Url || journal.image2,
                    ...(template === '02' && { image3: image3Url || journal.image3 }), 
                    coverImg: coverImgUrl || journal.coverImg
                }
            });
        } catch (error) {
            Alert.alert('Oh no!', 'We couldn’t capture your updates. Please try again.');
            console.log('Firestore update error:', error);
        } finally {
            setLoading(false);
            stopTypingAnimation(); 
        }
    };

    const startTypingAnimation = () => {
        const textLength = loadingText.length;
        const typingDuration = 300;
        const totalDuration = textLength * typingDuration;

        Animated.sequence([
            Animated.timing(typingAnimation, {
                toValue: textLength,
                duration: totalDuration,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const stopTypingAnimation = () => {
        typingAnimation.setValue(0);
    };

    const getAnimatedText = () => {
        const animatedText = loadingText.split('').map((char, index) => {
            const opacity = typingAnimation.interpolate({
                inputRange: [index, index + 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            });
            return (
                <Animated.Text key={index} style={[styles.animatedText, { opacity }]}>
                    {char}
                </Animated.Text>
            );
        });
        return animatedText;
    };



    return (
        <ImageBackground
            source={require('../../assets/journalBG.jpeg')} 
            style={styles.background}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity onPress={() => pickImage(setCoverImg)} style={styles.coverImageContainer}>
                        {coverImg ? (
                            <Image source={{ uri: coverImg }} style={styles.image} />
                        ) : (
                            <Text style={styles.imagePlaceholder}>Cover Image</Text>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={styles.journalTitle}
                        placeholder="Journal Title"
                        value={journalTitle}
                        onChangeText={setJournalTitle}
                        placeholderTextColor="#7a5e48" 
                    />

                    {template === '01' ? ( 
                        <View style={styles.row}>

                            {/* First Image Picker */}
                            <View style={styles.poloroidContainer1}>
                                {journal.image1 ? (
                                    <Image source={{ uri: image1 }} style={styles.image} />
                                ) : (
                                    <Text style={styles.imagePlaceholder}>Image 1</Text>
                                )}

                            </View>




                            {/* Second Image Picker */}
                            <View style={styles.poloroidContainer2}>
                                {journal.image2 ? (
                                    <Image source={{ uri: image2 }} style={styles.image} />
                                ) : (
                                    <Text style={styles.imagePlaceholder}>Image 2</Text>
                                )}
                            </View>
                        </View>
                    ) : <View style={styles.row}>

                        {/* First Image Picker */}
                        <View style={styles.poloroidContainerA}>
                            {journal.image1 ? (
                                <Image source={{ uri: image1 }} style={styles.image} />
                            ) : (
                                <Text style={styles.imagePlaceholder}>Image 1</Text>
                            )}

                        </View>




                        {/* Second Image Picker */}
                        <View style={styles.poloroidContainerB}>
                            {journal.image2 ? (
                                <Image source={{ uri: image2 }} style={styles.image} />
                            ) : (
                                <Text style={styles.imagePlaceholder}>Image 2</Text>
                            )}

                        </View>

                        {/* Second Image Picker */}
                        <View style={styles.poloroidContainerC}>
                            {journal.image3 ? (
                                <Image source={{ uri: image3 }} style={styles.image} />
                            ) : (
                                <Text style={styles.imagePlaceholder}>Image 3</Text>
                            )}
                        </View>
                    </View>
                    }

                    {/* Journal Text Input */}
                    <ImageBackground
                        source={require('../../assets/inputBg.png')} 
                        style={styles.background}
                    >
                        <TextInput
                            style={styles.journalInput}
                            placeholder="Write your journal here..."
                            multiline={true}
                            value={journalText}
                            onChangeText={setJournalText}
                            placeholderTextColor="#7a5e48" 
                        />
                    </ImageBackground>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                        <Text style={styles.saveButtonText}>Save Journal</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            {/* Custom Loading Modal */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={loading}
                onRequestClose={() => setLoading(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <ActivityIndicator size="large" color="#424ef5" />
                        <View style={styles.typingContainer}>
                            {getAnimatedText()}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* // Privacy Selection Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={privacyModalVisible}
                onRequestClose={() => setPrivacyModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Select Privacy Option</Text>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                saveJournalWithPrivacy('Public'); 
                            }}
                        >
                            <Text style={styles.optionText}>Public</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                saveJournalWithPrivacy('Private'); 
                            }}
                        >
                            <Text style={styles.optionText}>Private</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setPrivacyModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};


export default EditJournal;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        marginTop: 30,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    journalTitle: {
        fontSize: 32,
        fontFamily: 'PatricHand',
        color: '#6e4a32',
        marginBottom: 20,
        textAlign: 'center',
    },
    date: {
        fontSize: 16,
        fontFamily: 'PatricHand', 
        color: '#6e4a32',
        marginBottom: 20,
        textAlign: 'left',
    },
    coverImageContainer: {
        borderColor: '#d9b98a',
        borderWidth: 2,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    imageContainer: {
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        marginBottom: 20,
        height: 150,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    poloroidContainer1: {
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 20,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: 180,
        transform: [{ rotate: '-5deg' }],
    },
    poloroidContainer2: {
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 20,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: 180,
        transform: [{ rotate: '5deg' }],
    },
    image: {
        width: '98%',
        height: '90%',
        marginBottom: 10,
    },
    imagePlaceholder: {
        fontSize: 18,
        color: '#7a7a7a',
    },
    journalInput: {
        width: '100%',
        minHeight: 250,
        borderRadius: 10,
        padding: 15,
        fontSize: 20,
        fontFamily: 'PatricHand',
        textAlignVertical: 'top',
        color: '#5a4032',
    },
    poloroidContainerA: {
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 20,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: 120,
        transform: [{ rotate: '-5deg' }],
    },
    poloroidContainerB: {
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 20,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: 120,
    },
    poloroidContainerC: {
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 20,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: 120,
        transform: [{ rotate: '5deg' }],
    },
    journalImage: {
        width: '100%', 
        height: 100, 
        justifyContent: 'flex-end', 
    },
    imageStyle: {
        borderRadius: 10, 
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)', 
        paddingVertical: 10,
        paddingHorizontal: 15,
        height: 100,
        justifyContent: 'center', 
    },
    journalTitle: {
        fontSize: 30,
        color: '#000',
        fontFamily: 'PatricHand',
        textAlign: 'center',
    },
    journalDate: {
        fontSize: 15,
        color: '#000',
        textAlign: 'right',
        marginTop: 10,
        fontFamily: 'PatricHand'
    },
    saveButton: {
        backgroundColor: '#74512D',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 20,
    },
    saveButtonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: '#74512D',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
    },
    cancelButton: {
        marginTop: 10,
        padding: 10,
    },
    cancelText: {
        color: '#d9534f',
        fontSize: 18,
    },
    typingContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
    animatedText: {
        fontFamily: 'PatricHand',
        fontSize: 20,
        color: '#74512D', 
    },

});
