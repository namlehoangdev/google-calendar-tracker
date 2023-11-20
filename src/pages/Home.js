import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Heading, Flex, Table, Thead, Tbody, Tr, Th, Td, Checkbox } from '@chakra-ui/react';

import AuthenticateModal from '../components/AuthenticateModal';
import Footer from '../components/Footer';


import { loadCalendars } from '../services/calendarsService';
import { loadAllEventsInCalendar } from '../services/eventsService';
 

function CalendarTable({ calendars, calendarIds }) {
    if (!calendarIds || calendarIds.length == 0) {
        return "Nothing to show";
    }

    function renderCalendarNames() {
        return calendarIds.map((calendarId) => {
            const calendar = calendars[calendarId];
            const { summary, backgroundColor, foregroundColor, selected } = calendar;
            return (
                <Tr key={calendarId}>

                    <Td style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                            isReadOnly={true}
                            colorScheme={backgroundColor}
                            style={{
                                backgroundColor: selected ? backgroundColor : 'white',
                                borderColor: backgroundColor,
                                color: foregroundColor,
                            }}
                            defaultChecked={selected}
                            marginRight={'8px'}
                        />
                        {summary}
                    </Td>

                </Tr>
            );
        })
    }
    return (
        <Table variant="simple" >
            <Thead>
                <Tr>
                    <Th>My calendars</Th>
                    <Th>Number of past events</Th>
                    <Th>Number of happenning events</Th>
                    <Th>Number of upcomming events</Th>
                </Tr>
            </Thead>
            <Tbody>
                {renderCalendarNames()}
            </Tbody>
        </Table>
    );
}


export default function Home() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated, (prevValue, curValue) => {
         return !!prevValue === !! curValue;
      });
    const { calendarIds, calendars } = useSelector((state) => state.calendar);


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
            dispatch(loadAllEventsInCalendar(calendarId));
        }
    }, [JSON.stringify(calendarIds)]);


    return (
        <Flex flexDirection="column" minHeight="100vh">
            <Box p={4}>

                <AuthenticateModal />
                <Heading as="h1" size="md" color="blue.500">
                    Scheduling tool
                </Heading>

                <CalendarTable calendarIds={calendarIds} calendars={calendars} />

            </Box>
            <Footer />
        </Flex >
    );
};