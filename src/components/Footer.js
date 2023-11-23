import React from 'react';
import { Box, Text, Link, Flex } from '@chakra-ui/react';
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";
import { ContactInfo } from "configs";

function Footer() {
    return (
        <Box as="footer" py={2} px={10} bg="blue.50" textAlign="center" marginTop="auto" flexDirection="column">
            <Flex
                as="footer"
                align="center"
                justify="center"
                height="60px"
            >
                <Text fontSize="sm">
                    Please contact me at{" "}
                    <Link href={`mailto:${ContactInfo.EMAIL}`} color="blue.600">
                        {ContactInfo.EMAIL}
                    </Link>{" "}
                    or call me at{" "}
                    <Link href={`tel:${ContactInfo.PHONE}`} color="blue.600">
                        {ContactInfo.PHONE}
                    </Link>
                    .
                </Text>
                <Flex
                    as="footer"
                    align="center"
                    justify="center"
                    height="60px"
                    color="blue.600"
                    ml="auto"
                >
                    <Box mx={2}>
                        <Link href={ContactInfo.LINKEDIN} isExternal>
                            <FaLinkedin size={20} />
                        </Link>
                    </Box>
                    <Box mx={2}>
                        <Link href={ContactInfo.FACEBOOK} isExternal>
                            <FaFacebook size={20} />
                        </Link>
                    </Box>
                    <Box mx={2}>
                        <Link href={ContactInfo.GITHUB} isExternal>
                            <FaGithub size={20} />
                        </Link>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
}

export default Footer;