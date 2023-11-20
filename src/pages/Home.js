import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Heading, Input, Flex } from '@chakra-ui/react';

import AuthenticateModal from '../components/AuthenticateModal';
import Footer from '../components/Footer';
import CalendarTable from './CalendarTable';

import { loadCalendars } from '../services/calendarsService';
import { loadAllEventsInCalendar } from '../services/eventsService';
import { triggerUpdateTime } from '../services/commonService';
import { getCurrentTimeISO8601, convertToISOWithTimeZone } from '../utils';

import { FaEllipsisV, FaSync } from "react-icons/fa";



export default function Home() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated, (prevValue, curValue) => {
        return !!prevValue === !!curValue;
    });
    const { calendarIds, calendars } = useSelector((state) => state.calendar);
    const { currentTimeISO8601 } = useSelector((state) => state.common);
    const eventsByCalendarId = useSelector((state) => state.event);


    console.log("currentTime", currentTimeISO8601);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        } else {
            dispatch(loadCalendars());
        }
    }, [isAuthenticated])


    useEffect(() => {
        const time = getCurrentTimeISO8601();
        for (let calendarId of calendarIds) {
            dispatch(loadAllEventsInCalendar({ calendarId, currentTime: time, queryOptions: {} }));
        }
    }, [JSON.stringify(calendarIds)]);

    function handleInputChange(event) {
        dispatch(triggerUpdateTime(event.target.value + ":00Z"));
    }

    function handleRefreshCalendar(calendarId) {
        dispatch(loadAllEventsInCalendar({ calendarId, currentTime: currentTimeISO8601, queryOptions: {} }));
    }


    return (
        <Flex flexDirection="column" minHeight="100vh">
            <AuthenticateModal />
            <Box p={4}>
                <Heading as="h1" size="md" color="blue.500">
                    Scheduling tool
                </Heading>
                <Flex mb={4} mt={4} center="center">
                    <Input
                        value={convertToISOWithTimeZone(currentTimeISO8601)}
                        onChange={handleInputChange}
                        placeholder="Select Date and Time"
                        size="md"
                        type="datetime-local"
                        isReadOnly={true}
                    />
                </Flex>
                <CalendarTable calendarIds={calendarIds} calendars={calendars} eventsByCalendarId={eventsByCalendarId}
                    onRefresh={handleRefreshCalendar} />
            </Box>
            <Footer />
        </Flex >
    );
};