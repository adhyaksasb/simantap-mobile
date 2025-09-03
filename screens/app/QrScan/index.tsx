import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCameraPermissions } from "expo-camera";
import { Link } from "expo-router";

export default () => {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <Center className="flex-1">
      <Heading className="font-bold text-2xl">QR Scanner</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">Mutasi Keluar</Text>
      <VStack className="gap-2">
        <Button onPress={requestPermission}>
          <ButtonText>Aktifkan Permisi</ButtonText>
        </Button>
        <Link href={"/(tabs)/qr-scan/scanner"} asChild>
          <Button variant="outline" disabled={!isPermissionGranted}>
            <ButtonText>Scan QR</ButtonText>
          </Button>
        </Link>
      </VStack>
    </Center>
  );
};
