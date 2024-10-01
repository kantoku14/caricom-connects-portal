import React, { useState } from 'react';
import { Button, useToast, useDisclosure } from '@chakra-ui/react';
import { ModalMessage, showMessage, messages, Message } from '../utils/message'; // Import the message and handler from messages.ts

export function ExampleComponent() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState<Message | null>(null);

  // Simulate a form submission that triggers a message
  const handleSubmit = () => {
    const message = messages.form.submissionSuccess();
    showMessage(message, toast, setModalMessage);
    if (message.modal) {
      onOpen(); // Trigger modal open if the message requires a modal
    }
  };

  // Simulate an error during login
  const handleLoginFailure = () => {
    const message = messages.auth.loginFailure();
    showMessage(message, toast, setModalMessage);
  };

  return (
    <div>
      <Button colorScheme="teal" onClick={handleSubmit}>
        Submit Form (Success)
      </Button>
      <Button colorScheme="red" ml={4} onClick={handleLoginFailure}>
        Trigger Login Failure (Error)
      </Button>

      {/* Modal Component */}
      <ModalMessage
        isOpen={isOpen}
        onClose={onClose}
        modalMessage={modalMessage}
      />
    </div>
  );
}

export default ExampleComponent;
