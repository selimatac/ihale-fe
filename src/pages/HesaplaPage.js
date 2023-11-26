import {
  Badge,
  Button,
  Card,
  Center,
  Container,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataRequest } from "../store/firmaReducer";
import { NumericFormat } from "react-number-format";
import { DURUMLAR, getWithCurrencyFormat } from "../utils";
import * as XLSX from "xlsx/xlsx.mjs";

const HesaplaPage = () => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const { firmaData, firmaDataLoading } = useSelector((state) => state.firma);
  const [sonucTablosu, setSonucTablosu] = useState({});
  const [maliyet, setMaliyet] = useState({});
  const [hesaplamaTamamlandi, setHesaplamaTamamlandi] = useState(null);

  const exceleAktar = () => {
    const wb = XLSX.utils.table_to_book(tableRef.current);
    XLSX.writeFileXLSX(wb, `İhale-Sonucu-${Date.now()}.xlsx`);
  };

  const ihaleyiHesapla = (e) => {
    e.preventDefault();
    setHesaplamaTamamlandi(false);
    const sonuc = firmaData
      .toSorted((a, b) => {
        if (a.teklifi !== b.teklifi) {
          //teklifi eşit değilse teklifi yüksek olanı yıkarı taşı.
          return a.teklifi - b.teklifi;
        } else {
          //teklifi eşitse teminat tutarı yüksek olanı yukarı taşı.
          return b.teminatTutari - a.teminatTutari;
        }
      })
      .map((teklif) => {
        const { _id, firmaAdi, teklifi, teminatTutari } = teklif;

        if (teminatTutari < teklifi * 0.03) {
          return {
            _id,
            firmaAdi,
            teklifi,
            teminatTutari,
            durumu: 2, // Teklif geçersiz
          };
        }

        if (teklifi > maliyet.floatValue) {
          return {
            _id,
            firmaAdi,
            teklifi,
            teminatTutari,
            durumu: 1, // Kazanamadı
          };
        }

        return {
          _id,
          firmaAdi,
          teklifi,
          teminatTutari,
          durumu: 0, // Kazandı
        };
      })
      //duruma göre sıralama yap.
      .sort((a, b) => a.durumu - b.durumu)
      //Eğer kazanan birden fazla ise durumunu Kazanamadı olarak değiştir.
      .map(({ _id, firmaAdi, teklifi, teminatTutari, durumu }, i) =>
        i !== 0 && durumu === 0
          ? { _id, firmaAdi, teklifi, teminatTutari, durumu: 1 }
          : { _id, firmaAdi, teklifi, teminatTutari, durumu }
      );

    //Eğer sonucunda kazanan yoksa durumu ihale durumu belirlenir.
    const durumu =
      sonuc.filter((x) => x.durumu === 0).length === 1 ? "TAMAMLANDI" : "İPTAL";

    setSonucTablosu({
      sonuc,
      durumu,
    });
    // Hesaplama tamamlandıktan sonra tabloyu göstermek için.
    setTimeout(() => {
      setHesaplamaTamamlandi(true);
    }, 1500);
  };

  useEffect(() => {
    dispatch(getDataRequest());
  }, []);

  if (firmaData.length === 0 && firmaDataLoading) {
    return (
      <Center>
        <Spinner size={"lg"} />
      </Center>
    );
  }
  return (
    <>
      <Container mb={4}>
        <form onSubmit={ihaleyiHesapla}>
          <InputGroup size="lg">
            <NumericFormat
              required={true}
              customInput={Input}
              autoComplete="off"
              prefix="₺"
              thousandSeparator=","
              decimalSeparator="."
              fixedDecimalScale
              decimalScale={2}
              onValueChange={(values) => setMaliyet(values)}
              disabled={hesaplamaTamamlandi === false}
              name="maliyet"
              size={"lg"}
              pr="5rem"
              placeholder="Yaklaşık Maliyet Tutarı (TL)"
            />
            <InputRightElement width="auto">
              <Button
                isLoading={hesaplamaTamamlandi === false}
                mr={1}
                type="submit"
              >
                Hesapla
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </Container>
      {hesaplamaTamamlandi === false && (
        <Center>
          <Heading size={"md"} color="gray">
            Hesaplama Yapılıyor...
          </Heading>
        </Center>
      )}
      {hesaplamaTamamlandi ? (
        <Card mb={8}>
          <TableContainer>
            <Table variant="simple" size={"lg"}>
              <Thead>
                <Tr>
                  <Th colSpan={4}>İHALE DEĞERLENDİRME TABLOSU</Th>
                  <Th colSpan={1} textAlign={"right"}>
                    <Button onClick={exceleAktar} type="button">
                      Excell'e Aktar
                    </Button>
                  </Th>
                </Tr>
              </Thead>
            </Table>
            <Table variant="simple" size={"lg"} ref={tableRef}>
              <Thead>
                <Tr>
                  <Th colSpan={2}>İHALE DURUMU</Th>
                  <Th colSpan={3}>{sonucTablosu?.durumu}</Th>
                </Tr>
              </Thead>
              <Thead>
                <Tr>
                  <Th>SIRALAMA</Th>
                  <Th w="full">FİRMA İSMİ</Th>
                  <Th>TEKLİF (TL)</Th>
                  <Th>TEMİNAT TUTARI (TL)</Th>
                  <Th>FİRMA DURUMU</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sonucTablosu?.sonuc.map((x, i) => (
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td>{x.firmaAdi}</Td>
                    <Td>{getWithCurrencyFormat(x.teklifi)}</Td>
                    <Td>{getWithCurrencyFormat(x.teminatTutari)}</Td>
                    <Td>
                      {" "}
                      <Badge
                        ml="1"
                        fontSize="0.8em"
                        colorScheme={
                          x.durumu === 0
                            ? "green"
                            : x.durumu === 1
                            ? "orange"
                            : "red"
                        }
                      >
                        {DURUMLAR[x.durumu]}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot bg={"gray.100"}>
                <Tr>
                  <Td></Td>
                  <Td></Td>
                  <Td textAlign={"center"}>
                    <Heading size={"md"} fontWeight={"md"}>
                      Yaklaşık Maliyet Tutarı:
                    </Heading>
                  </Td>
                  <Td>
                    <Heading size={"md"} fontWeight={"md"}>
                      {` ${maliyet.formattedValue} `}
                    </Heading>
                  </Td>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Card>
      ) : null}
    </>
  );
};

export default HesaplaPage;
