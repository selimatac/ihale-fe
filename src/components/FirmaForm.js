import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { addFirmaRequest, updateFirmaRequest } from "../store/firmaReducer";
import { NumericFormat } from "react-number-format";

const FirmaForm = ({ data, cb }) => {
  const dispatch = useDispatch();
  const { firmaFormActionLoading } = useSelector((state) => state.firma);
  const [teklifi, setTeklifi] = useState({});
  const [teminatTutari, setTeminatTutari] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firmaAdi } = e.target;
    const values = {
      firmaAdi: firmaAdi.value,
      teklifi: teklifi.floatValue,
      teminatTutari: teminatTutari.floatValue,
    };
    const { _id } = data;
    if (_id) {
      await dispatch(
        updateFirmaRequest({
          id: _id,
          updatedData: {
            ...values,
          },
        })
      );
    } else {
      await dispatch(
        addFirmaRequest({
          ...values,
        })
      );
    }
    cb();
  };

  return (
    <Box w={"100%"} as="form" onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>Firma Adı*</FormLabel>
        <Input
          type="text"
          required
          placeholder="Firma Adı"
          name="firmaAdi"
          defaultValue={data?.firmaAdi ?? ""}
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Teklifi*</FormLabel>
        <NumericFormat
          placeholder="Teklifi"
          name="teklifi"
          required={true}
          customInput={Input}
          prefix="₺"
          thousandSeparator=","
          decimalSeparator="."
          fixedDecimalScale
          decimalScale={2}
          defaultValue={data?.teklifi ?? null}
          onValueChange={(values) => setTeklifi(values)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Teminat Tutarı*</FormLabel>
        <NumericFormat
          placeholder="Teminat Tutarı"
          name="teminatTutari"
          required={true}
          customInput={Input}
          prefix="₺"
          thousandSeparator=","
          decimalSeparator="."
          fixedDecimalScale
          decimalScale={2}
          defaultValue={data?.teminatTutari ?? null}
          onValueChange={(values) => setTeminatTutari(values)}
        />
      </FormControl>
      <Box gap={2} mt={4} justifyContent={"flex-end"}>
        <Button
          type="submit"
          colorScheme="blue"
          mr={3}
          isLoading={firmaFormActionLoading}
        >
          Kaydet
        </Button>
        <Button type="button" onClick={cb}>
          Vazgeç
        </Button>
      </Box>
    </Box>
  );
};

export default FirmaForm;
