import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  Container,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, SettingsIcon } from "@chakra-ui/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const NavLink = (props) => {
  const location = useLocation();
  const { children, to } = props;
  return (
    <Box
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      bg={
        location.pathname === to
          ? "gray.200"
          : ""
      }
    >
      <Link to={to}>{children}</Link>
    </Box>
  );
};

export default function Layout(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "  none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box fontWeight={"semibold"}>Firma Takip Sistemi</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <NavLink to="/">Ana sayfa</NavLink>
              <NavLink to="/hesapla">İhale Hesapla</NavLink>
            </HStack>
          </HStack>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <NavLink to="/">Ana sayfa</NavLink>
              <NavLink to="/hesapla">İhale Hesapla</NavLink>
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Container maxW={"container.xl"} p={4}>
        <Outlet />
      </Container>
    </>
  );
}
