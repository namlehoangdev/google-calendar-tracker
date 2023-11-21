
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button
    , useDisclosure,
    ModalBody
} from '@chakra-ui/react'
import { FaGoogle } from "react-icons/fa";
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
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size="xs" isCentered={true}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Login</ModalHeader>
                <ModalBody>
                    Login to sync calendars and events from your Google Calendar
                </ModalBody>
                <ModalFooter>
                    <Button 
                        variant="outline" onClick={handleSignIn}
                        leftIcon={<FaGoogle color='tomato' />}>
                        Continue with Google
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}