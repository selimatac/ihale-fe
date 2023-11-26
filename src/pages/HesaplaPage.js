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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataRequest } from "../store/firmaReducer";
import { NumericFormat } from "react-number-format";
import { DURUMLAR, getWithCurrencyFormat } from "../utils";
import * as XLSX from "xlsx/xlsx.mjs";

const HesaplaPage = () => {
  const dispatch = useDispatch();
  const { firmaData } = useSelector((state) => state.firma);
  const [sonucTablosu, setSonucTablosu] = useState({});
  const [maliyet, setMaliyet] = useState({});
  const [hesaplamaTamamlandi, setHesaplamaTamamlandi] = useState(null);

  const exceleAktar = () => {
    const sonuc = sonucTablosu.sonuc.map((x, i) => {
      return {
        Sıralama: i + 1,
        "Firma Adı": x.firmaAdi,
        Teklifi: getWithCurrencyFormat(x.teklifi),
        "Teminat Tutarı": getWithCurrencyFormat(x.teminatTutari),
        Durumu: DURUMLAR[x.durumu],
      };
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sonuc);

    XLSX.utils.book_append_sheet(wb, ws, "İhale Sonucu");
    XLSX.writeFile(wb, `İhale-Sonucu-${Date.now()}.xlsx`);
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
        <Card>
          <TableContainer>
            <Table variant="simple" size={"lg"}>
              <Thead>
                <Tr>
                  <Th colSpan={4}>İHALE DEĞERLENDİRME TABLOSU</Th>
                  <Th colSpan={1}>
                    <Button onClick={exceleAktar} type="button">
                      Excell'e Aktar
                    </Button>
                  </Th>
                </Tr>
              </Thead>
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
            </Table>
          </TableContainer>
        </Card>
      ) : null}
    </>
  );
};

export default HesaplaPage;
