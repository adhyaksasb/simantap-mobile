import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
} from "@/components/ui/radio";
import { CircleIcon } from "@/components/ui/icon";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export default () => {
  const { colorMode, setColorMode, resolvedMode } = useContext(ThemeContext);

  const iconColor = resolvedMode === "dark" ? "#fff" : "#000";

  return (
    <View className="flex-1 p-4">
      <RadioGroup
        value={colorMode}
        onChange={(value) => setColorMode(value as "light" | "dark" | "system")}
        accessibilityLabel="Theme options"
      >
        <VStack className="gap-4">
          {/* System */}
          <Radio value="system" size="md" className="w-full">
            <HStack className="justify-between w-full">
              <HStack className="gap-4">
                <Ionicons
                  name="phone-portrait-outline"
                  color={iconColor}
                  size={24}
                />
                <Text className="font-semibold text-lg">
                  Gunakan Pengaturan HP
                </Text>
              </HStack>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
            </HStack>
          </Radio>
          <Divider className="w-full" />

          {/* Light */}
          <Radio value="light" size="md" className="w-full">
            <HStack className="justify-between w-full">
              <HStack className="gap-4">
                <Ionicons name="sunny-outline" color={iconColor} size={24} />
                <Text className="font-semibold text-lg">Light Mode</Text>
              </HStack>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
            </HStack>
          </Radio>
          <Divider className="w-full" />

          {/* Dark */}
          <Radio value="dark" size="md" className="w-full">
            <HStack className="justify-between w-full">
              <HStack className="gap-4">
                <Ionicons name="moon-outline" color={iconColor} size={24} />
                <Text className="font-semibold text-lg">Dark Mode</Text>
              </HStack>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
            </HStack>
          </Radio>
          <Divider className="w-full" />
        </VStack>
      </RadioGroup>
    </View>
  );
};
