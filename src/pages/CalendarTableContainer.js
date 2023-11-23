import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Table, Thead, Box, Link, Tbody, Icon, Button, Spinner, Tr, Th, Td, Flex, Checkbox, Text, useDisclosure, Progress,
    CircularProgress, CircularProgressLabel, Skeleton
} from '@chakra-ui/react';
import { FaEllipsisV, FaSync } from "react-icons/fa";

import { EventListModal } from 'components';
import { getDiffs, parseDateTime } from 'utils/dateTimeUtil';
import { setWarningColor, getIsLoadingStyle } from 'utils/uiUtil';


function containDescriptionCol(calendarIds, calendars) {
    if (!calendarIds || calendarIds.length === 0) {
        return false;
    }
    for (let id of calendarIds) {
        const desc = calendars[id]?.description;
        if (desc && desc.trim().length > 0) {
            return true;
        }
    }
    return false;
}


export default function CalendarTable({ onRefresh = () => { } }) {
    const { calendarIds, calendars, isLoading } = useSelector((state) => state.calendar);
    const eventsByCalendarId = useSelector((state) => state.event);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [modalData, setModalData] = useState({});

    const isRenderSkeleton = isLoading && (!calendarIds || calendarIds.length === 0);

    const hasDescCol = containDescriptionCol(calendarIds, calendars);
    console.log(hasDescCol);


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

        const offRate = Math.round(tilNowOff / Math.max(tilNowPassed, 1) * 100);

        return (
            <Td>
                <Flex direction="row">
                    <Flex mr={10} direction="column" alignContent={"center"} justifyContent={"center"}>
                        <Text mb={2} fontSize="xs" >Passed's off rate: <b>{offRate}</b>%</Text>
                        <Flex alignContent={"center"} justifyContent={"center"}>
                            <Box mr={2}>
                                <CircularProgress value={offRate} color={setWarningColor(offRate)} thickness={15} capIsRound={true} >
                                    <CircularProgressLabel>{offRate}%</CircularProgressLabel>
                                </CircularProgress>
                            </Box>
                            <Box opacity={0.5}>
                                <Box>
                                    <Text fontSize="xs">  <b>{tilNowOff}</b> off</Text>
                                </Box>
                                <Box borderTopWidth={1} borderTopColor={"black.200"}>
                                    <Text fontSize="xs">  <b>{Math.max(tilNowPassed, 1)}</b> events</Text>
                                </Box>
                            </Box>
                        </Flex>
                    </Flex>
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
                    </Flex>
                </Flex>
            </Td >)
    }

    function renderNames(calendar) {
        const { summary, backgroundColor, foregroundColor, selected } = calendar || {};


        return (<Td>
            <Flex direction="row" alignContent={"center"}>
                <Box mr={2} p={0} mt={0.5}>
                    <Checkbox
                        isReadOnly={true}
                        colorScheme={backgroundColor}
                        style={{
                            backgroundColor: selected ? backgroundColor : 'white',
                            borderColor: backgroundColor,
                            color: foregroundColor,
                        }}
                        defaultChecked={selected}
                    />
                </Box>
                <Text>{summary}</Text>
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
            <Text fontSize="sm" >
                <b>{monthDiff}</b> months or <b>{weekDiff}</b> weeks or  <b>{dayDiff}</b> days
            </Text>

            <Text as={"span"} fontSize="xs" opacity={0.5}>
                From  <b>{parseDateTime(firstEvent?.start)?.dateString}</b>{" "}
                to  <b>{parseDateTime(lastEvent?.end)?.dateString}</b>
            </Text>
            <Flex direction="column" mt={2}>
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
                    maxWidth={350}
                />
            </Flex>
        </Td>)
    }

    function renderDescription(calendar) {
        return hasDescCol &&
            (<Td>
                {calendar.description && calendar.description.split("\n").map(
                    desc => <Text>{desc}</Text>
                )}
            </Td>);

    }


    function renderRows() {
        return calendarIds && calendarIds.map((calendarId) => {
            const isClendarLoading = eventsByCalendarId[calendarId]?.isLoading;

            return (
                <Tr key={calendarId} {...getIsLoadingStyle(isClendarLoading)}>
                    {renderNames(calendars[calendarId])}
                    {renderDescription(calendars[calendarId])}
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

    function renderSkeletonRows() {
        return (<Tr>
            <Td>
                <Skeleton height={5} my={2} maxWidth={400} />
            </Td>
            <Td>
                <Skeleton height={5} my={2} maxWidth={300} />
                <Skeleton height={5} my={2} maxWidth={200} />
                <Skeleton height={5} my={2} maxWidth={100} />
            </Td>
            <Td>
                <Skeleton height={5} my={2} maxWidth={100} />
                <Skeleton height={5} my={2} maxWidth={200} />
                <Skeleton height={5} my={2} maxWidth={300} />
            </Td>
            <Td>

                <Skeleton height={5} my={2} maxWidth={100} />
                <Skeleton height={5} my={2} />
            </Td>
            <Td>
                <Skeleton height={5} my={2} maxWidth={50} />
                <Skeleton height={5} my={2} maxWidth={50} />
            </Td>
        </Tr>)
    }


    return (
        <>
            <Box overflowX="scroll">
                <Table variant="simple" >
                    <Thead position="sticky" top={0} zIndex="docked">
                        <Tr>
                            <Th>Calendars</Th>
                            {hasDescCol && <Th>Description</Th>}
                            <Th>Summary</Th>
                            <Th>Duration</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody {...getIsLoadingStyle(isLoading)}>
                        {isRenderSkeleton ? Array(3).fill().map(renderSkeletonRows) : renderRows()}
                    </Tbody>
                </Table>
            </Box>
            <EventListModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} {...modalData} />
        </>
    );
}