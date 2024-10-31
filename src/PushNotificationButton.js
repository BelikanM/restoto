import React from 'react';
import { usePushSubscription } from './push-subscription'; // Assurez-vous que le chemin est correct

const PushNotificationButton = () => {
  const subscription = usePushSubscription();

  return (
    <button onClick={() => console.log('Button clicked!')}>
      Enable Push Notifications
    </button>
  );
};

export default PushNotificationButton;
