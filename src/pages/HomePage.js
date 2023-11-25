import {
  Box,
  Button,
  Card,
  Center,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import FirmaCard from "../components/FirmaCard";
import { useDispatch, useSelector } from "react-redux";
import { getDataRequest } from "../store/firmaReducer";
import { AddIcon } from "@chakra-ui/icons";
import FirmaForm from "../components/FirmaForm";
import { useModal } from "react-modal-hook";
import CustomModal from "../components/CustomModal";

const HomePage = () => {
  const dispatch = useDispatch();
  const { firmaData, firmaDataLoading } = useSelector((state) => state.firma);
  const [showModal, hideModal] = useModal(
    () => (
      <CustomModal title="Firma Ekle" isOpen={showModal} onClose={hideModal}>
        <FirmaForm
          data={{}}
          cb={async () => {
            await dispatch(getDataRequest());
            hideModal();
          }}
        />
      </CustomModal>
    ),
    []
  );

  useEffect(() => {
    dispatch(getDataRequest());
  }, []);

  return (
    <Box>
      {firmaData.length === 0 && firmaDataLoading ? (
        <Center>
          <Spinner size={"lg"} />
        </Center>
      ) : (
        <SimpleGrid spacing={4} templateColumns="repeat(auto-fit, minmax(320px, 1fr))">
          {firmaData?.map((firma, index) => (
            <FirmaCard data={firma} key={index} />
          ))}
          <Card textAlign="center" p={4} w={"100%"} minH={"186px"}>
            <Heading as="h2" size="xl" mb={2}>
              Firma Ekle
            </Heading>
            <Text color={"gray.500"}>
              İhaleye katılacak firmaları ekleyiniz.
            </Text>
            <Button variant="solid" mt={"auto"} w={"100%"} onClick={showModal}>
              Ekle <AddIcon ml={2} />
            </Button>
          </Card>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default HomePage;
