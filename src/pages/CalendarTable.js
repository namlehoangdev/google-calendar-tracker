import React, { useState } from 'react';

import { Table, Thead, Box, ListIcon, Link, Tbody, Icon, Button, Tr, Th, Td, Flex, Checkbox, Tag, Text, useDisclosure, UnorderedList, ListItem, Progress } from '@chakra-ui/react';

import EventListModal from '../components/EventListModal';
import { FaEllipsisV, FaSync } from "react-icons/fa";

import { getMonthDiff, simpleShortDays } from '../utils';




export default function CalendarTable({ calendars, calendarIds, eventsByCalendarId, onRefresh = () => { } }) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [modalData, setModalData] = useState({});

    if (!calendarIds || calendarIds.length == 0) {
        return "";
    }

    function handleClick(modalData) {
        setModalData(modalData);
        onOpen();
    }

    function renderEventCounters(eventObj = {}, calendarId) {
        const { happeningIds = [], upcomingIds = [], pastIds = [], events,
            sortedByStartTimeIds = [],
            pastOff = 0, happeningOff = 0, upcomingOff = 0 } = eventObj || {}

        //TODO: show error
        const totalOff = pastOff + upcomingOff + happeningOff;
        const tilNowPassed = happeningIds.length + pastIds.length;
        const tilNowOff = happeningOff + pastOff;

        const activePassed = tilNowPassed - tilNowOff;
        const totalBooked = sortedByStartTimeIds.length;

        return (
            <Td>
                <Flex direction="column">
                    {upcomingOff > 0 &&
                        <>
                            <Link
                                color={"red"}
                                onClick={() => handleClick({ eventObj: eventsByCalendarId[calendarId], title: calendars[calendarId]?.summary })}>
                                Errors there are <b>{upcomingOff}</b> future events marked OFFLINE. <br />Please <b>delete</b> it or <b>remove the "off:" tag</b>  !!
                                Click to see more.

                            </Link>
                            <br />
                        </>}
                    <Text fontSize="sm" >
                        Upcoming <b>{upcomingIds.length}</b>
                    </Text>


                    <Text fontSize="sm" >
                        Active passed: <b>{activePassed}</b>
                        <Text as={"span"} fontSize="xs" opacity={0.5} ml={3}>  (<b>{tilNowPassed}</b> events - <b>{tilNowOff}</b> offs)</Text>
                    </Text>




                    <Text fontSize="sm" >Total available: <b>{totalBooked - tilNowOff}</b>
                        <Text as={"span"} fontSize="xs" opacity={0.5} ml={3}> (<b>{totalBooked}</b> events - <b>{tilNowOff}</b> offs)</Text>
                    </Text>


                </Flex >
            </Td >)
    }

    function renderNames(calendar, eventObj, calendarId) {
        const { summary, backgroundColor, foregroundColor, selected } = calendar || {};
        const { happeningIds = [], pastIds = [], sortedByStartTimeIds = [], pastOff = 0, happeningOff = 0 } = eventObj || {}

        const totalAvailable = sortedByStartTimeIds.length - (happeningOff + pastOff);
        const activePassed = happeningIds.length + pastIds.length - (happeningOff + pastOff);
        const progress = Math.round(activePassed / Math.max(totalAvailable, 1) * 100, 2);

        return (<Td>
            <Flex direction="row" alignContent={"center"}>
                <Checkbox
                    isReadOnly={true}
                    colorScheme={backgroundColor}
                    style={{
                        backgroundColor: selected ? backgroundColor : 'white',
                        borderColor: backgroundColor,
                        color: foregroundColor,
                    }}
                    defaultChecked={selected}
                    mr={2}
                />
                {summary}
            </Flex>
            <br />
            <Flex direction="column">
                <Text
                    fontSize="md"
                    color="blue.500"
                    fontWeight="bold"
                    pb=".2rem"
                >{`${progress}%`}</Text>
                <Progress
                    colorScheme="blue"
                    size="xs"
                    value={progress}
                    borderRadius="15px"
                />
            </Flex>
        </Td>)
    }


    function renderEventTimes(eventObj) {
        const { events, sortedByStartTimeIds = [], } = eventObj || {};

        const firstEvent = sortedByStartTimeIds.length > 0 ? events[sortedByStartTimeIds[0]] : null;
        const lastEvent = sortedByStartTimeIds.length > 0 ? events[sortedByStartTimeIds[sortedByStartTimeIds.length - 1]] : null;

        return (<Td>
            <Flex direction="column">
                <Text fontSize="sm" >
                    Total months <b>{getMonthDiff(firstEvent?.start?.dateTime || 0,
                        lastEvent?.start?.dateTime || 0)}</b>
                    <Text as={"span"} fontSize="xs" opacity={0.5} ml={3}>
                        From  <b>{simpleShortDays(firstEvent?.start?.dateTime)}</b>  to  <b>{simpleShortDays(lastEvent?.start?.dateTime)}</b>
                    </Text>
                </Text>

            </Flex>
        </Td>)

    }


    function renderRows() {
        return calendarIds && calendarIds.map((calendarId) => {
            return (
                <Tr key={calendarId}>
                    {renderNames(calendars[calendarId], eventsByCalendarId[calendarId])}
                    {renderEventCounters(eventsByCalendarId[calendarId], calendarId)}
                    {renderEventTimes(eventsByCalendarId[calendarId])}
                    <Td>
                        <Button p="0px" bg="transparent" onClick={() => handleClick({ eventObj: eventsByCalendarId[calendarId], title: calendars[calendarId]?.summary })}>
                            <Icon as={FaEllipsisV} color="gray.500" cursor="pointer" />
                        </Button>

                        <Button p="0px" bg="transparent" onClick={() => onRefresh(calendarId)}>
                            <Icon as={FaSync} color="gray.500" cursor="pointer" />
                        </Button>
                    </Td>
                </Tr >
            );
        })
    }


    return (
        <>
            <Box overflowX="scroll">
                <Table variant="simple" >
                    <Thead>
                        <Tr>
                            <Th>My calendars</Th>
                            <Th>Summary</Th>
                            <Th>Times</Th>
                            <Th>Events</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {renderRows()}
                    </Tbody>
                </Table>
            </Box>
            <EventListModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} {...modalData} />
        </>
    );
}