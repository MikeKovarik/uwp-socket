# uwp-socket

### Easy to use Node-like wrapper for DataWriter/DataReader used in Windows UWP Apis like StreamSocket, Serial and Bluetooth communication, etc...

The `lib/` folder contains `UwpSocket.js`, a Node stream/socket like wrapper for UWP's `Windows.Storage.Streams` `DataWriter` and `DataReader` API. A more generalized and universal derivation from previous work on [winrt-net](https://github.com/MikeKovarik/winrt-net) which sees a continuation in the `/lib-net` directory.

Initial proof-of-concept work has been done on using `UwpSocket` class with `Windows.Devices.SerialCommunication` (and `Windows.Devices.Bluetooth`) in the `/lib-serial` folder.

Note: This is not a working nor published npm project at the moment. It's rather just a dirty prototype (especially the `/lib-serial`) scraped from a UWP app I used to work on before `serialport` started their [work on UWP support](https://github.com/EmergingTechnologyAdvisors/node-serialport/pull/940).
