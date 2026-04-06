import {
  Button,
  Popover,
  Surface,
  ListBox,
  Header,
  Label,
  Description,
  Kbd,
  Separator,
  useOverlayState,
} from "@heroui/react";

interface BranchCardContextMenuProps {
  state: ReturnType<typeof useOverlayState>;
  position: {
    x: number;
    y: number;
  };
}

const BranchCardContextMenu = ({
  position,
  state,
}: BranchCardContextMenuProps) => {
  return (
    <div className="flex items-center gap-4">
      <Popover isOpen={state.isOpen} onOpenChange={state.toggle}>
        <Popover.Content
          className="max-w-64"
          style={{ left: position.x, top: position.y }}
        >
          <Popover.Dialog className="w-64 p-0">
            <ListBox
              aria-label="File actions"
              className="w-full p-2"
              selectionMode="none"
              onAction={(key) => alert(`Selected item: ${key}`)}
            >
              <ListBox.Section>
                <Header>Actions</Header>
                <ListBox.Item id="new-file" textValue="New file">
                  <div className="flex h-8 items-start justify-center pt-px"></div>
                  <div className="flex flex-col">
                    <Label>New file</Label>
                    <Description>Create a new file</Description>
                  </div>
                  <Kbd className="ms-auto" variant="light">
                    <Kbd.Abbr keyValue="command" />
                    <Kbd.Content>N</Kbd.Content>
                  </Kbd>
                </ListBox.Item>
                <ListBox.Item id="edit-file" textValue="Edit file">
                  <div className="flex h-8 items-start justify-center pt-px"></div>
                  <div className="flex flex-col">
                    <Label>Edit file</Label>
                    <Description>Make changes</Description>
                  </div>
                  <Kbd className="ms-auto" variant="light">
                    <Kbd.Abbr keyValue="command" />
                    <Kbd.Content>E</Kbd.Content>
                  </Kbd>
                </ListBox.Item>
              </ListBox.Section>
              <Separator />
              <ListBox.Section>
                <Header>Danger zone</Header>
                <ListBox.Item
                  id="delete-file"
                  textValue="Delete file"
                  variant="danger"
                >
                  <div className="flex h-8 items-start justify-center pt-px"></div>
                  <div className="flex flex-col">
                    <Label>Delete file</Label>
                    <Description>Move to trash</Description>
                  </div>
                  <Kbd className="ms-auto" variant="light">
                    <Kbd.Abbr keyValue="command" />
                    <Kbd.Abbr keyValue="shift" />
                    <Kbd.Content>D</Kbd.Content>
                  </Kbd>
                </ListBox.Item>
              </ListBox.Section>
            </ListBox>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default BranchCardContextMenu;
