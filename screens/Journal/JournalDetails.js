import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert, ImageBackground
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

const JournalDetails = ({ route, navigation }) => {
    const { journal } = route.params;
    const [userEmail, setUserEmail] = useState('');

    const getUserDetails = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        } else {
            console.log('User not logged in');
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const handleEditPress = () => {
        navigation.navigate('EditJournal', { journal });
    };

    const handleDeletePress = async () => {
        Alert.alert(
            'Confirm Delete',
            'Ready to remove this memory?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const journalRef = doc(db, 'journals', journal.id);
                            await deleteDoc(journalRef);
                            Alert.alert('Gone!', 'The entry has been erased.!');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Oops!', 'We couldn’t remove the entry.');
                            console.error('Error deleting journal:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <ImageBackground
            source={require('../../assets/journalBG.jpeg')}
            style={styles.background}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity
                    style={styles.journalItem}
                >
                    <ImageBackground
                        source={{ uri: journal.coverImg }}
                        style={styles.journalImage}
                        imageStyle={styles.imageStyle}
                    >
                        <View style={styles.overlay}>
                            <Text style={styles.journalTitle}>
                                {journal.journalTitle}
                            </Text>
                            <Text style={styles.journalDate}>
                                {journal.createdAt}
                            </Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>

                {journal.template === '01' ? (
                    <View style={styles.row}>

                        {/* First Image Picker */}
                        <View style={styles.poloroidContainer1}>
                            {journal.image1 ? (
                                <Image source={{ uri: journal.image1 }} style={styles.image} />
                            ) : (
                                <Text style={styles.imagePlaceholder}>Image 1</Text>
                            )}

                        </View>




                        {/* Second Image Picker */}
                        <View style={styles.poloroidContainer2}>
                            {journal.image2 ? (
                                <Image source={{ uri: journal.image2 }} style={styles.image} />
                            ) : (
                                <Text style={styles.imagePlaceholder}>Image 2</Text>
                            )}
                        </View>
                    </View>
                ) : <View style={styles.row}>

                    {/* First Image Picker */}
                    <View style={styles.poloroidContainerA}>
                        {journal.image1 ? (
                            <Image source={{ uri: journal.image1 }} style={styles.image} />
                        ) : (
                            <Text style={styles.imagePlaceholder}>Image 1</Text>
                        )}

                    </View>




                    {/* Second Image Picker */}
                    <View style={styles.poloroidContainerB}>
                        {journal.image2 ? (
                            <Image source={{ uri: journal.image2 }} style={styles.image} />
                        ) : (
                            <Text style={styles.imagePlaceholder}>Image 2</Text>
                        )}

                    </View>

                    {/* Second Image Picker */}
                    <View style={styles.poloroidContainerC}>
                        {journal.image3 ? (
                            <Image source={{ uri: journal.image3 }} style={styles.image} />
                        ) : (
                            <Text style={styles.imagePlaceholder}>Image 3</Text>
                        )}
                    </View>
                </View>
                }


                <ImageBackground
                    source={require('../../assets/inputBg.png')} 
                    style={styles.background}
                >

                    {/* Journal Text Input */}
                    <Text
                        style={styles.journalInput}>
                        {journal.journalText}
                    </Text>
                </ImageBackground>

                {userEmail === journal.user ? ( 
                    <View style={styles.btnRow}>
                        <TouchableOpacity
                            style={styles.btncontainer}
                            onPress={handleEditPress} 
                        >
                            <Image
                                source={require('../../assets/edit.png')} 
                                style={styles.buttonImage}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btncontainer}
                            onPress={handleDeletePress} 
                        >
                            <Image
                                source={require('../../assets/delete.png')} 
                                style={styles.buttonImage}
                            />
                        </TouchableOpacity>
                    </View>

                ) : null}
            </ScrollView>
        </ImageBackground>
    );
};

export default JournalDetails;

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
    btncontainer: {
        backgroundColor: '#74512D',
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    buttonImage: {
        width: 40,
        width: 40,
    },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
});
