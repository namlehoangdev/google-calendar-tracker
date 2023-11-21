
import React, { useEffect } from 'react';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Tr, Td, Thead, Table, Tbody, Th,
    Tag,
    Badge,
    ModalCloseButton,
    ModalFooter,
    Text,
    ModalBody,
} from '@chakra-ui/react'

import { getBeautyTimeISO8601, parseDateTime } from '../utils';
import { OFF_FLAG } from '../config';


export default function EventListModal({ title, eventObj, isOpen, onOpen, onClose }) {
    const { happeningIds = [], upcomingIds = [], pastIds = [], events,
        sortedByStartTimeIds = [],
        pastOff = 0, happeningOff = 0, upcomingOff = 0 } = eventObj || {}

    const totalOff = pastOff + upcomingOff + happeningOff;
    const tilNowPassed = happeningIds.length + pastIds.length;
    const tilNowOff = happeningOff + pastOff;

    const activePassed = tilNowPassed - tilNowOff;
    const totalBooked = sortedByStartTimeIds.length;


    const reversedPassedIds = pastIds.concat(happeningIds).reverse();
    const reversedUpcomingIds = [...upcomingIds].reverse();



    function getStatusConfig(summary, isUpcoming) {
        const isOff = summary.startsWith(OFF_FLAG)
        if (isUpcoming) {
            return isOff ? { status: "ERROR", bgStatus: "tomato" } : { status: "Available", bgStatus: "blue.400" }

        }
        return isOff ? { status: "Off", bgStatus: "gray.400" } : { status: "Active", bgStatus: "green.400" }
    }


    function renderRows(ids, events, isUpcoming) {
        if (!events || !ids) {
            return null;
        }
        return (ids.map(id => {
            const { summary, start: rawStart, end: rawEnd } = events[id] || {};

            const { status, bgStatus } = getStatusConfig(summary, isUpcoming);

            const start = parseDateTime(rawStart);
            const end = parseDateTime(rawEnd);

            return (<Tr key={id} opacity={isUpcoming ? 1 : 0.5}>
                <Td >
                    {summary}
                </Td>
                <Td whiteSpace="nowrap">
                    {start.time} {start.dateString}
                </Td>
                <Td whiteSpace="nowrap">
                    {end.time} {end.dateString}
                </Td>
                <Td>
                    <Badge bg={bgStatus} color={"white"} >
                        {status}
                    </Badge>

                </Td>
            </Tr>)

        }))
    }

    if (!sortedByStartTimeIds || sortedByStartTimeIds.length === 0) {
        return (<Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered={true}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>No events</Text>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xxl" isCentered={true} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Table variant="simple" size="sm">
                        <Thead position="sticky" top={0} zIndex="docked" background={'white'}>
                            <Tr>
                                <Th>Event name</Th>
                                <Th>Start time</Th>
                                <Th>End time</Th>
                                <Th>Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {renderRows(reversedUpcomingIds, events, true)}
                            {renderRows(reversedPassedIds, events, false)}
                        </Tbody>
                    </Table>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    );
}