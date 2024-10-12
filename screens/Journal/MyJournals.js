import { View, Text, StyleSheet, TouchableOpacity, Image, Button, Modal, Pressable, FlatList, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { useFocusEffect } from '@react-navigation/native';

const MyJournals = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [journals, setJournals] = useState([]); 
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

    
    useFocusEffect(
        React.useCallback(() => {
            const fetchJournals = async () => {
                try {
                    const auth = getAuth();
                    const user = auth.currentUser;
    
                    if (user) {
                        const journalCollection = collection(db, 'journals');
                        const q = query(journalCollection, where('user', '==', user.email));
                        const journalSnapshot = await getDocs(q);
                        const journalList = journalSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setJournals(journalList);
                    } else {
                        console.log('User not logged in');
                    }
                } catch (error) {
                    console.error('Error fetching journals:', error);
                }
            };
    
            fetchJournals();
        }, [])
    );
    
    const renderJournalItem = ({ item }) => (
        <TouchableOpacity
            style={styles.journalItem}
            onPress={() => navigation.navigate('JournalDetails', { journal: item })}
        >
            <ImageBackground
                source={{ uri: item.coverImg }}
                style={styles.journalImage}
                imageStyle={styles.imageStyle}
            >
                <View style={styles.overlay}>
                    <Text style={styles.journalTitle}>
                        {item.journalTitle}
                    </Text>
                    <Text style={styles.journalDate}>
                        {item.createdAt}
                    </Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../../assets/journalBG.jpeg')}
            style={styles.background}
        >
        <View style={styles.container}>
            <Text style={styles.title}> My Journals </Text>

            {/* List of Saved Journals */}
            <FlatList
                data={journals}
                renderItem={renderJournalItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.journalList}
            />

<View style={styles.btnRow}>
            <TouchableOpacity
                style={styles.btncontainer}
                onPress={() => setModalVisible(true)}
            >
                <Image
                    source={require('../../assets/add1.png')}
                    style={styles.buttonImage}
                />
            </TouchableOpacity>
            </View>

            {/* Modal to select journal template */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Select a Template</Text>

                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('Template 01');
                            }}
                        >
                            <Text style={styles.textStyle}>Template 1</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('Template 02');
                            }}
                        >
                            <Text style={styles.textStyle}>Template 2</Text>
                        </Pressable>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>

            </Modal>
        </View>
        </ImageBackground>
    );
}

export default MyJournals;

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
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    btncontainer: {
        backgroundColor: '#74512D',
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    buttonImage: {
        width: 40,
        width: 40,
    },
    journalList: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#5a4032',
    },
    journalItem: {
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, 
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
        backgroundColor: 'rgba(255, 255, 255, 0.7)', 
        paddingVertical: 10,
        paddingHorizontal: 15,
        height: 100,
        justifyContent: 'center', 
    },
    journalTitle: {
        fontSize: 26,
        color: '#000',
        fontFamily: 'PatricHand'
    },
    journalDate: {
        fontSize: 14,
        color: '#7a7a7a',
        textAlign: 'right',
        marginTop: 10,
        fontFamily: 'PatricHand'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginVertical: 10,
        width: '100%',
    },
    buttonClose: {
        backgroundColor: '#74512D',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cancelButton: {
        marginTop: 10,
        padding: 10,
    },
    cancelText: {
        color: '#d9534f',
        fontSize: 18,
    },
});
