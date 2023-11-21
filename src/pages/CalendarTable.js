import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Thead, Box, ListIcon, Link, Tbody, Icon, Button, Spinner, Tr, Th, Td, Flex, Checkbox, Tag, Text, useDisclosure, UnorderedList, ListItem, Progress } from '@chakra-ui/react';

import EventListModal from '../components/EventListModal';
import { FaEllipsisV, FaSync } from "react-icons/fa";

import { getDiffs, simpleShortDays } from '../utils';

function getIsLoadingStyle(isLoading) {
    return isLoading ? {
        style: {
            pointerEvents: isLoading ? 'none' : 'auto',
            opacity: isLoading ? 0.5 : 1,
        },
    } : {};
}


export default function CalendarTable({ onRefresh = () => { } }) {
    const { calendarIds, calendars, isLoading } = useSelector((state) => state.calendar);
    const eventsByCalendarId = useSelector((state) => state.event);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [modalData, setModalData] = useState({});


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
                                Errors there are <b>{upcomingOff}</b> future events marked offline. <br />Please <b>delete</b> it or <b>remove the "off:" tag</b>.
                                Click to see more.

                            </Link>
                            <br />
                        </>}
                    <Text fontSize="sm" >
                        Upcoming: <b>{upcomingIds.length}</b>
                    </Text>


                    <Text fontSize="sm" >
                        Passed: <b>{activePassed}</b>
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

        </Td>)
    }


    function renderEventTimes(eventObj) {

        const { happeningIds = [], pastIds = [], sortedByStartTimeIds = [], pastOff = 0, happeningOff = 0, events } = eventObj || {}
        const firstEvent = sortedByStartTimeIds.length > 0 ? events[sortedByStartTimeIds[0]] : null;
        const lastEvent = sortedByStartTimeIds.length > 0 ? events[sortedByStartTimeIds[sortedByStartTimeIds.length - 1]] : null;



        const totalAvailable = sortedByStartTimeIds.length - (happeningOff + pastOff);
        const activePassed = happeningIds.length + pastIds.length - (happeningOff + pastOff);
        const progress = Math.round(activePassed / Math.max(totalAvailable, 1) * 100, 2);

        const { monthDiff, weekDiff, dayDiff } = getDiffs(firstEvent?.start?.dateTime || 0,
            lastEvent?.start?.dateTime || 0);

        return (<Td>
            <Flex direction="column">
                <Text fontSize="sm" >
                    <b>{monthDiff}</b> months or <b>{weekDiff}</b> weeks or  <b>{dayDiff}</b> days
                    <Text as={"span"} fontSize="xs" opacity={0.5} ml={3}>
                        From  <b>{simpleShortDays(firstEvent?.start?.dateTime)}</b>  to  <b>{simpleShortDays(lastEvent?.start?.dateTime)}</b>
                    </Text>
                </Text>

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


    function renderRows() {
        return calendarIds && calendarIds.map((calendarId) => {
            const isClendarLoading = eventsByCalendarId[calendarId]?.isLoading;
             
            return (
                <Tr key={calendarId} {...getIsLoadingStyle(isClendarLoading)}>
                    {renderNames(calendars[calendarId], eventsByCalendarId[calendarId])}
                    {renderEventCounters(eventsByCalendarId[calendarId], calendarId)}
                    {renderEventTimes(eventsByCalendarId[calendarId])}
                    <Td>
                        <Button p="0px" bg="transparent" onClick={() => handleClick({ eventObj: eventsByCalendarId[calendarId], title: calendars[calendarId]?.summary })}>
                            <Icon as={FaEllipsisV} color="gray.500" cursor="pointer" />
                        </Button>


                        <Button p="0px" bg="transparent" onClick={() => onRefresh(calendarId)}>
                            {isClendarLoading ? <Spinner size="md" color="blue.500" />
                                : <Icon as={FaSync} color="gray.500" cursor="pointer" />}
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
                    <Thead position="sticky" top={0} zIndex="docked">
                        <Tr>
                            <Th>My calendars</Th>
                            <Th>Summary</Th>
                            <Th>Duration</Th>
                            <Th>Events</Th>

                        </Tr>
                    </Thead>
                    <Tbody {...getIsLoadingStyle(isLoading)}>
                        {renderRows()}
                    </Tbody>
                </Table>
            </Box>
            <EventListModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} {...modalData} />
        </>
    );
}