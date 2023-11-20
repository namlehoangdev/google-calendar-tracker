import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';

function Footer() {
    return (
        <Box as="footer" py={4} bg="gray.200" textAlign="center" marginTop="auto">
            <Text fontSize="sm">
                For any inquiries, please contact me at{' '}
                <Link href="mailto:namlehoangdev@gmail.com" color="blue.500">
                    namlehoangdev@gmail.com
                </Link>{' '}
                or call me at{' '}
                <Link href="tel:(+84) 76 803 9789" color="blue.500">
                    +84768039789
                </Link>
                .
            </Text>
        </Box>
    );
}

export default Footer;