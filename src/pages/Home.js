import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Heading, Input, Flex, Button, Icon } from '@chakra-ui/react';

import AuthenticateModal from '../components/AuthenticateModal';
import Footer from '../components/Footer';
import CalendarTable from './CalendarTable';

import { loadCalendars } from '../services/calendarsService';
import { loadAllEventsInCalendar } from '../services/eventsService';
import { triggerUpdateTime } from '../services/commonService';
import { convertToISOWithTimeZone } from '../utils';

import { FaSync } from "react-icons/fa";



export default function Home() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated, (prevValue, curValue) => {
        return !!prevValue === !!curValue;
    });
    const { calendarIds, calendars } = useSelector((state) => state.calendar);
    const { currentTimeISO8601 } = useSelector((state) => state.common);
    const eventsByCalendarId = useSelector((state) => state.event);
    const [triggerRefreshAll, updateTriggerRefresh] = useState(false);


    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        } else {
            dispatch(loadCalendars());
        }
    }, [isAuthenticated])


    useEffect(() => {
        for (let calendarId of calendarIds) {
            dispatch(loadAllEventsInCalendar({ calendarId, currentTime: currentTimeISO8601, queryOptions: {} }));
        }
    }, [JSON.stringify(calendarIds), triggerRefreshAll]);

    function handleInputChange(event) {
        dispatch(triggerUpdateTime(event.target.value + ":00Z"));
    }

    function handleRefreshCalendar(calendarId) {
        dispatch(loadAllEventsInCalendar({ calendarId, currentTime: currentTimeISO8601, queryOptions: {} }));
    }

    function handleRefreshAll() {
        updateTriggerRefresh(!triggerRefreshAll);
    }


    return (
        <Flex flexDirection="column" minHeight="100vh">
            <AuthenticateModal />
            <Box p={4} mb={10}>
                <Flex mb={10} mt={10} center="center" align={"center"} justify={"center"}>
                    <Heading as="h1" size="md" color="blue.500">
                        Calendar's events analytics tool
                    </Heading>

                    <Input
                        ml={3}
                        value={convertToISOWithTimeZone(currentTimeISO8601)}
                        onChange={handleInputChange}
                        placeholder="Select Date and Time"
                        size="md"
                        type="datetime-local"
                        isReadOnly={true}
                        width={"200px"}
                    />
                    <Button p="0px" bg="transparent" onClick={handleRefreshAll}>
                        <Icon as={FaSync} color="gray.500" cursor="pointer" />
                    </Button>
                </Flex>
                <CalendarTable calendarIds={calendarIds} calendars={calendars} eventsByCalendarId={eventsByCalendarId}
                    onRefresh={handleRefreshCalendar} />
            </Box>
            <Footer />
        </Flex >
    );
};