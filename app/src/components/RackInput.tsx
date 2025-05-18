import { TextInput } from "react-native-paper";

type RackInputProps = {
  rackCode: string;
  updateRackCode: (newRackId: string) => void;
};

export default function RackInput({
  rackCode,
  updateRackCode,
}: RackInputProps) {
  return (
    <TextInput
      label="Bike Rack Code"
      mode="outlined"
      placeholder="Enter the bike rack code"
      value={rackCode}
      onChangeText={(text) => updateRackCode(text)}
      textColor="black"
      outlineColor="#7E7E7E"
      activeOutlineColor="#7E7E7E"
      style={{ backgroundColor: "white" }}
    />
  );
}
