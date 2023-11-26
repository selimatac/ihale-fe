import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Container,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const ErrorElement = () => {
  return (
    <Container mt={8}>
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        rounded={8}
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Oppss, birşeyler ters gitti.
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Birşeyler test gitti. Sayfayı yenileyebilir ya da aşağıdaki
          buton ile Anasayfa ya dönebilirsin.
        </AlertDescription>
        <Button mt={4} as={Link} colorScheme="red" to={"/"}>
          Ana sayfa
        </Button>
      </Alert>
    </Container>
  );
};

export default ErrorElement;
