import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { formatDate, getTimeDiff, getWithCurrencyFormat } from "../utils";
import { useDispatch } from "react-redux";
import FirmaForm from "./FirmaForm";
import { deleteFirmaRequest, getDataRequest } from "../store/firmaReducer";
import { useModal } from "react-modal-hook";
import CustomModal from "./CustomModal";

const FirmaCard = ({ data }) => {
  const dispatch = useDispatch();
  const [showEditModal, hideEditModal] = useModal(
    () => (
      <CustomModal
        title="Firma Güncelle"
        isOpen={showEditModal}
        onClose={hideEditModal}
      >
        <FirmaForm
          data={data}
          cb={async () => {
            await dispatch(getDataRequest());
            hideEditModal();
          }}
        />
      </CustomModal>
    ),
    [data]
  );

  const [showDeleteModal, hideDeleteModal] = useModal(
    () => (
      <CustomModal
        title="Firma Sil"
        isOpen={showDeleteModal}
        onClose={hideDeleteModal}
      >
        <Text>
          <strong>{data.firmaAdi} </strong>Firma silinecek onaylıyoor musunuz?
        </Text>
        <Box gap={2} mt={4} justifyContent={"flex-end"}>
          <Button
            type="button"
            colorScheme="blue"
            mr={3}
            onClick={async () => {
              await dispatch(deleteFirmaRequest({ id: data._id }));
              await dispatch(getDataRequest());
              hideDeleteModal();
            }}
          >
            Onayla
          </Button>
          <Button type="button" onClick={hideDeleteModal}>
            Vazgeç
          </Button>
        </Box>
      </CustomModal>
    ),
    []
  );

  return (
    <Card>
      <CardBody w={"full"}>
        <HStack justifyContent={"space-between"} alignItems={"flex-start"}>
          <VStack alignItems={"flex-start"}>
            <Heading size="md" noOfLines={2}>
              {data.firmaAdi}
            </Heading>
            <Text>
              <strong>Teklifi:</strong> {getWithCurrencyFormat(data.teklifi)}
            </Text>
            <Text>
              <strong>Teminat Tutarı:</strong>{" "}
              {getWithCurrencyFormat(data.teminatTutari)}
            </Text>
            <Text fontSize="sm">
              Kayıt Tarihi: {formatDate(data.createdAt)}
            </Text>
            <Text fontSize="sm">
              Son Güncelleme Tarihi: {getTimeDiff(data.updatedAt)}
            </Text>
          </VStack>
          <VStack p={0} gap={2}>
            <IconButton
              size="sm"
              aria-label="Düzenle"
              onClick={showEditModal}
              colorScheme="teal"
              icon={<EditIcon />}
            />
            <IconButton
              size="sm"
              aria-label="Sil"
              colorScheme="red"
              onClick={showDeleteModal}
              icon={<DeleteIcon />}
            />
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default FirmaCard;
