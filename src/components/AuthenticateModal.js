
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
    ModalBody,
    useDisclosure,
} from '@chakra-ui/react'
import { FaGoogle } from "react-icons/fa";
import { login } from 'services/authService';
import { ApiCalendar } from 'apis';



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
        const authInfo = await ApiCalendar.handleAuthClick();
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