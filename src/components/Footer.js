import React from 'react';
import { Box, Text, Link, Flex } from '@chakra-ui/react';
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";

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
                    <Link href="mailto:namlehoangdev@gmail.com" color="blue.600">
                        namlehoangdev@gmail.com
                    </Link>{" "}
                    or call me at{" "}
                    <Link href="tel:+84768039789" color="blue.600">
                        +84768039789
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
                        <Link href="https://www.linkedin.com/in/lehoangnam/" isExternal>
                            <FaLinkedin size={20} />
                        </Link>
                    </Box>
                    <Box mx={2}>
                        <Link href="https://www.facebook.com/namlehoangdev/" isExternal>
                            <FaFacebook size={20} />
                        </Link>
                    </Box>
                    <Box mx={2}>
                        <Link href="https://github.com/namlehoangdev" isExternal>
                            <FaGithub size={20} />
                        </Link>
                    </Box>
                </Flex>
            </Flex>


        </Box>
    );
}

export default Footer;