import EditScreenInfo from "@/components/EditScreenInfo";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import useAuth from "@/hooks/useAuthGuard";

export default () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Center className="flex-1">
      <Heading className="font-bold text-2xl">Welcome, {user?.name}</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">Example below to use gluestack-ui components.</Text>
      <EditScreenInfo path="app/(app)/(tabs)/tab1.tsx" />
    </Center>
  );
};
