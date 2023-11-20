
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button
    , useDisclosure
} from '@chakra-ui/react'
import apiCalendar from '../apiCalendar';
import { login } from '../services/authService';


export default function AuthenticateModal({ onSuccess = () => { } }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            onOpen();
        } else {
            onClose();
        }
    }, [isAuthenticated])


    async function handleSignIn() {
        const authInfo = await apiCalendar.handleAuthClick();
        dispatch(login(authInfo));
        onSuccess();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Please Sign in</ModalHeader>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleSignIn}>
                        Sign in with Google
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}