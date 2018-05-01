export var gattArray = [
	{
		id: '1800',
		type: 'service',
		name: ' Generic Access',
		tag:  'generic_access',
		children: ['2a00', '2a01', '2a02', '2a03', '2a04']
	}, {
		id: '1801',
		type: 'service',
		name: 'Generic Attribute',
		tag:  'generic_attribute',
		children: ['2a05']
	}, {
		id: '1802',
		type: 'service',
		name: 'Immediate Alert',
		tag:  'immediate_alert',
		children: ['2a06']
	}, {
		id: '1803',
		type: 'service',
		name: 'Link Loss',
		tag:  'link_loss',
		children: ['2a06']
	}, {
		id: '1804',
		type: 'service',
		name: 'Tx Power',
		tag:  'tx_power',
		children: ['2a07']
	}, {
		id: '1805',
		type: 'service',
		name: 'Current Time Service',
		tag:  'current_time',
		children: ['2a2b', '2a0f', '2a14']
	}, {
		id: '1806',
		type: 'service',
		name: 'Reference Time Update Service',
		tag:  'reference_time_update',
		children: ['2a16', '2a17']
	}, {
		id: '1807',
		type: 'service',
		name: 'Next DST Change Service',
		tag:  'next_dst_change',
		children: ['2a11']
	}, {
		id: '1808',
		type: 'service',
		name: 'Glucose',
		tag:  'glucose',
		children: ['2a18', '2a34', '2a51', '2a52']
	}, {
		id: '1809',
		type: 'service',
		name: 'Health Thermometer',
		tag:  'health_thermometer',
		children: ['2a1c', '2a1d', '2a1e', '2a21']
	}, {
		id: '180a',
		type: 'service',
		name: 'Device Information',
		tag:  'device_information',
		children: ['2a29', '2a24', '2a25', '2a27', '2a26', '2a28', '2a23', '2a2a', '2a50']
	}, {
		id: '180d',
		type: 'service',
		name: 'Heart Rate',
		tag:  'heart_rate',
		children: ['2a37', '2a38', '2a39']
	}, {
		id: '180e',
		type: 'service',
		name: 'Phone Alert Status Service',
		tag:  'phone_alert_status',
		children: ['2a3f', '2a41', '2a40']
	}, {
		id: '180f',
		type: 'service',
		name: 'Battery Service',
		tag:  'battery_service',
		children: ['2a19']
	}, {
		id: '1810',
		type: 'service',
		name: 'Blood Pressure',
		tag:  'blood_pressure',
		children: ['2a35', '2a36', '2a49']
	}, {
		id: '1811',
		type: 'service',
		name: 'Alert Notification Service',
		tag:  'alert_notification',
		children: ['2a47', '2a46', '2a48', '2a45', '2a44']
	}, {
		id: '1812',
		type: 'service',
		name: 'Human Interface Device',
		tag:  'human_interface_device',
		children: ['2a4e', '2a4d', '2a4b', '2a22', '2a32', '2a33', '2a4a', '2a4c']
	}, {
		id: '1813',
		type: 'service',
		name: 'Scan Parameters',
		tag:  'scan_parameters',
		children: ['2a4f', '2a31']
	}, {
		id: '1814',
		type: 'service',
		name: 'Running Speed and Cadence',
		tag:  'running_speed_and_cadence',
		children: ['2a53', '2a54', '2a5d', '2a55']
	}, {
		id: '1815',
		type: 'service',
		name: 'Automation IO',
		tag:  'automation_io',
		children: ['2a56', '2a58', '2a5a']
	}, {
		id: '1816',
		type: 'service',
		name: 'Cycling Speed and Cadence',
		tag:  'cycling_speed_and_cadence',
		children: ['2a5b', '2a5c', '2a5d', '2a55']
	}, {
		id: '1818',
		type: 'service',
		name: 'Cycling Power',
		tag:  'cycling_power',
		children: ['2a63', '2a65', '2a5d', '2a64', '2a66']
	}, {
		id: '1819',
		type: 'service',
		name: 'Location and Navigation',
		tag:  'location_and_navigation',
		children: ['2a6a', '2a67', '2a69', '2a6b', '2a68']
	}, {
		id: '181a',
		type: 'service',
		name: 'Environmental Sensing',
		tag:  'environmental_sensing',
		children: ['2a7d', '2a73', '2a72', '2a7b', '2a6c', '2a74', '2a7a', '2a6f', '2a77', '2a75', '2a78', '2a6d', '2a6e', '2a71', '2a70', '2a76', '2a79', '2aa3', '2a2c', '2aa0', '2aa1']
	}, {
		id: '181b',
		type: 'service',
		name: 'Body Composition',
		tag:  'body_composition',
		children: ['2a9b', '2a9c']
	}, {
		id: '181c',
		type: 'service',
		name: 'User Data',
		tag:  'user_data',
		children: ['2a8a', '2a90', '2a87', '2a80', '2a85', '2a8c', '2a98', '2a8e', '2a96', '2a8d', '2a92', '2a91', '2a7f', '2a83', '2a93', '2a86', '2a97', '2a8f', '2a88', '2a89', '2a7e', '2a84', '2a81', '2a82', '2a8b', '2a94', '2a95', '2a99', '2a9a', '2a9f', '2aa2']
	}, {
		id: '181d',
		type: 'service',
		name: 'Weight Scale',
		tag:  'weight_scale',
		children: ['2a9e', '2a9d']
	}, {
		id: '181e',
		type: 'service',
		name: 'Bond Management Service',
		tag:  'bond_management',
		children: ['2aa4', '2aa5']
	}, {
		id: '181f',
		type: 'service',
		name: 'Continuous Glucose Monitoring',
		tag:  'continuous_glucose_monitoring',
		children: ['2aa7', '2aa8', '2aa9', '2aaa', '2aab', '2a52', '2aac']
	}, {
		id: '1820',
		type: 'service',
		name: 'Internet Protocol Support Service',
		tag:  'internet_protocol_support',
	}, {
		id: '1821',
		type: 'service',
		name: 'Indoor Positioning',
		tag:  'indoor_positioning',
		children: ['2aad', '2aae', '2aaf', '2ab0', '2ab1', '2ab2', '2ab3', '2ab4', '2ab5']
	}, {
		id: '1822',
		type: 'service',
		name: 'Pulse Oximeter Service',
		tag:  'pulse_oximeter',
		children: ['2a5e', '2a5f', '2a60', '2a52']
	}, {
		id: '1823',
		type: 'service',
		name: 'HTTP Proxy',
		tag:  'http_proxy',
		children: ['2ab6', '2ab7', '2ab9', '2aba', '2ab8', '2abb']
	}, {
		id: '1824',
		type: 'service',
		name: 'Transport Discovery',
		tag:  'transport_discovery',
		children: ['2abc']
	}, {
		id: '1825',
		type: 'service',
		name: 'Object Transfer Service',
		tag:  'object_transfer',
		children: ['2abd', '2abe', '2abf', '2ac0', '2ac1', '2ac2', '2ac3', '2ac4', '2ac5', '2ac6', '2ac7', '2ac8']
	}, {
		id: '1826',
		type: 'service',
		name: 'Fitness Machine',
		tag:  'fitness_machine',
		children: ['2acc', '2acd', '2ace', '2acf', '2ad0', '2ad1', '2ad2', '2ad3', '2ad4', '2ad5', '2ad6', '2ad8', '2ad7', '2ad9', '2ada']
	}, {
		id: '1829',
		type: 'service',
		name: 'Reconnection Configuration',
		tag:  'reconnection_configuration',
		children: ['2b1d', '2b1e', '2b1f']
	}, {
		id: '2a00',
		type: 'characteristic',
		name: 'Device Name',
		tag:  'gap.device_name',
	}, {
		id: '2a01',
		type: 'characteristic',
		name: 'Appearance',
		tag:  'gap.appearance',
	}, {
		id: '2a02',
		type: 'characteristic',
		name: 'Peripheral Privacy Flag',
		tag:  'gap.peripheral_privacy_flag',
	}, {
		id: '2a03',
		type: 'characteristic',
		name: 'Reconnection Address',
		tag:  'gap.reconnection_address',
	}, {
		id: '2a04',
		type: 'characteristic',
		name: 'Peripheral Preferred Connection Parameters',
		tag:  'gap.peripheral_preferred_connection_parameters',
	}, {
		id: '2a05',
		type: 'characteristic',
		name: 'Service Changed',
		tag:  'gatt.service_changed',
	}, {
		id: '2a06',
		type: 'characteristic',
		name: 'Alert Level',
		tag:  'alert_level',
	}, {
		id: '2a07',
		type: 'characteristic',
		name: 'Tx Power Level',
		tag:  'tx_power_level',
	}, {
		id: '2a0f',
		type: 'characteristic',
		name: 'Local Time Information',
		tag:  'local_time_information',
	}, {
		id: '2a11',
		type: 'characteristic',
		name: 'Time with DST',
		tag:  'time_with_dst',
	}, {
		id: '2a14',
		type: 'characteristic',
		name: 'Reference Time Information',
		tag:  'reference_time_information',
	}, {
		id: '2a16',
		type: 'characteristic',
		name: 'Time Update Control Point',
		tag:  'time_update_control_point',
	}, {
		id: '2a17',
		type: 'characteristic',
		name: 'Time Update State',
		tag:  'time_update_state',
	}, {
		id: '2a18',
		type: 'characteristic',
		name: 'Glucose Measurement',
		tag:  'glucose_measurement',
	}, {
		id: '2a19',
		type: 'characteristic',
		name: 'Battery Level',
		tag:  'battery_level',
	}, {
		id: '2a1c',
		type: 'characteristic',
		name: 'Temperature Measurement',
		tag:  'temperature_measurement',
	}, {
		id: '2a1d',
		type: 'characteristic',
		name: 'Temperature Type',
		tag:  'temperature_type',
	}, {
		id: '2a1e',
		type: 'characteristic',
		name: 'Intermediate Temperature',
		tag:  'intermediate_temperature',
	}, {
		id: '2a21',
		type: 'characteristic',
		name: 'Measurement Interval',
		tag:  'measurement_interval',
	}, {
		id: '2a22',
		type: 'characteristic',
		name: 'Boot Keyboard Input Report',
		tag:  'boot_keyboard_input_report',
	}, {
		id: '2a23',
		type: 'characteristic',
		name: 'System ID',
		tag:  'system_id',
	}, {
		id: '2a24',
		type: 'characteristic',
		name: 'Model Number String',
		tag:  'model_number_string',
	}, {
		id: '2a25',
		type: 'characteristic',
		name: 'Serial Number String',
		tag:  'serial_number_string',
	}, {
		id: '2a26',
		type: 'characteristic',
		name: 'Firmware Revision String',
		tag:  'firmware_revision_string',
	}, {
		id: '2a27',
		type: 'characteristic',
		name: 'Hardware Revision String',
		tag:  'hardware_revision_string',
	}, {
		id: '2a28',
		type: 'characteristic',
		name: 'Software Revision String',
		tag:  'software_revision_string',
	}, {
		id: '2a29',
		type: 'characteristic',
		name: 'Manufacturer Name String',
		tag:  'manufacturer_name_string',
	}, {
		id: '2a2a',
		type: 'characteristic',
		name: 'IEEE 11073-20601 Regulatory Certification Data List',
		tag:  'ieee_11073-20601_regulatory_certification_data_list',
	}, {
		id: '2a2b',
		type: 'characteristic',
		name: 'Current Time',
		tag:  'current_time',
	}, {
		id: '2a2c',
		type: 'characteristic',
		name: 'Magnetic Declination',
		tag:  'magnetic_declination',
	}, {
		id: '2a31',
		type: 'characteristic',
		name: 'Scan Refresh',
		tag:  'scan_refresh',
	}, {
		id: '2a32',
		type: 'characteristic',
		name: 'Boot Keyboard Output Report',
		tag:  'boot_keyboard_output_report',
	}, {
		id: '2a33',
		type: 'characteristic',
		name: 'Boot Mouse Input Report',
		tag:  'boot_mouse_input_report',
	}, {
		id: '2a34',
		type: 'characteristic',
		name: 'Glucose Measurement Context',
		tag:  'glucose_measurement_context',
	}, {
		id: '2a35',
		type: 'characteristic',
		name: 'Blood Pressure Measurement',
		tag:  'blood_pressure_measurement',
	}, {
		id: '2a36',
		type: 'characteristic',
		name: 'Intermediate Cuff Pressure',
		tag:  'intermediate_cuff_pressure',
	}, {
		id: '2a37',
		type: 'characteristic',
		name: 'Heart Rate Measurement',
		tag:  'heart_rate_measurement',
	}, {
		id: '2a38',
		type: 'characteristic',
		name: 'Body Sensor Location',
		tag:  'body_sensor_location',
	}, {
		id: '2a39',
		type: 'characteristic',
		name: 'Heart Rate Control Point',
		tag:  'heart_rate_control_point',
	}, {
		id: '2a3f',
		type: 'characteristic',
		name: 'Alert Status',
		tag:  'alert_status',
	}, {
		id: '2a40',
		type: 'characteristic',
		name: 'Ringer Control point',
		tag:  'ringer_control_point',
	}, {
		id: '2a41',
		type: 'characteristic',
		name: 'Ringer Setting',
		tag:  'ringer_setting',
	}, {
		id: '2a44',
		type: 'characteristic',
		name: 'Alert Notification Control Point',
		tag:  'alert_notification_control_point',
	}, {
		id: '2a45',
		type: 'characteristic',
		name: 'Unread Alert Status',
		tag:  'unread_alert_status',
	}, {
		id: '2a46',
		type: 'characteristic',
		name: 'New Alert',
		tag:  'new_alert',
	}, {
		id: '2a47',
		type: 'characteristic',
		name: 'Supported New Alert Category',
		tag:  'supported_new_alert_category',
	}, {
		id: '2a48',
		type: 'characteristic',
		name: 'Supported Unread Alert Category',
		tag:  'supported_unread_alert_category',
	}, {
		id: '2a49',
		type: 'characteristic',
		name: 'Blood Pressure Feature',
		tag:  'blood_pressure_feature',
	}, {
		id: '2a4a',
		type: 'characteristic',
		name: 'HID Information',
		tag:  'hid_information',
	}, {
		id: '2a4b',
		type: 'characteristic',
		name: 'Report Map',
		tag:  'report_map',
	}, {
		id: '2a4c',
		type: 'characteristic',
		name: 'HID Control Point',
		tag:  'hid_control_point',
	}, {
		id: '2a4d',
		type: 'characteristic',
		name: 'Report',
		tag:  'report',
	}, {
		id: '2a4e',
		type: 'characteristic',
		name: 'Protocol Mode',
		tag:  'protocol_mode',
	}, {
		id: '2a4f',
		type: 'characteristic',
		name: 'Scan Interval Window',
		tag:  'scan_interval_window',
	}, {
		id: '2a50',
		type: 'characteristic',
		name: 'PnP ID',
		tag:  'pnp_id',
	}, {
		id: '2a51',
		type: 'characteristic',
		name: 'Glucose Feature',
		tag:  'glucose_feature',
	}, {
		id: '2a52',
		type: 'characteristic',
		name: 'Record Access Control Point',
		tag:  'record_access_control_point',
	}, {
		id: '2a53',
		type: 'characteristic',
		name: 'RSC Measurement',
		tag:  'rsc_measurement',
	}, {
		id: '2a54',
		type: 'characteristic',
		name: 'RSC Feature',
		tag:  'rsc_feature',
	}, {
		id: '2a55',
		type: 'characteristic',
		name: 'SC Control Point',
		tag:  'sc_control_point',
	}, {
		id: '2a56',
		type: 'characteristic',
		name: 'Digital',
		tag:  'digital',
	}, {
		id: '2a58',
		type: 'characteristic',
		name: 'Analog',
		tag:  'analog',
	}, {
		id: '2a5a',
		type: 'characteristic',
		name: 'Aggregate',
		tag:  'aggregate',
	}, {
		id: '2a5b',
		type: 'characteristic',
		name: 'CSC Measurement',
		tag:  'csc_measurement',
	}, {
		id: '2a5c',
		type: 'characteristic',
		name: 'CSC Feature',
		tag:  'csc_feature',
	}, {
		id: '2a5d',
		type: 'characteristic',
		name: 'Sensor Location',
		tag:  'sensor_location',
	}, {
		id: '2a5e',
		type: 'characteristic',
		name: 'PLX Spot-Check Measurement',
		tag:  'plx_spot_check_measurement',
	}, {
		id: '2a5f',
		type: 'characteristic',
		name: 'PLX Continuous Measurement Characteristic',
		tag:  'plx_continuous_measurement',
	}, {
		id: '2a60',
		type: 'characteristic',
		name: 'PLX Features',
		tag:  'plx_features',
	}, {
		id: '2a63',
		type: 'characteristic',
		name: 'Cycling Power Measurement',
		tag:  'cycling_power_measurement',
	}, {
		id: '2a64',
		type: 'characteristic',
		name: 'Cycling Power Vector',
		tag:  'cycling_power_vector',
	}, {
		id: '2a65',
		type: 'characteristic',
		name: 'Cycling Power Feature',
		tag:  'cycling_power_feature',
	}, {
		id: '2a66',
		type: 'characteristic',
		name: 'Cycling Power Control Point',
		tag:  'cycling_power_control_point',
	}, {
		id: '2a67',
		type: 'characteristic',
		name: 'Location and Speed Characteristic',
		tag:  'location_and_speed',
	}, {
		id: '2a68',
		type: 'characteristic',
		name: 'Navigation',
		tag:  'navigation',
	}, {
		id: '2a69',
		type: 'characteristic',
		name: 'Position Quality',
		tag:  'position_quality',
	}, {
		id: '2a6a',
		type: 'characteristic',
		name: 'LN Feature',
		tag:  'ln_feature',
	}, {
		id: '2a6b',
		type: 'characteristic',
		name: 'LN Control Point',
		tag:  'ln_control_point',
	}, {
		id: '2a6c',
		type: 'characteristic',
		name: 'Elevation',
		tag:  'elevation',
	}, {
		id: '2a6d',
		type: 'characteristic',
		name: 'Pressure',
		tag:  'pressure',
	}, {
		id: '2a6e',
		type: 'characteristic',
		name: 'Temperature',
		tag:  'temperature',
	}, {
		id: '2a6f',
		type: 'characteristic',
		name: 'Humidity',
		tag:  'humidity',
	}, {
		id: '2a70',
		type: 'characteristic',
		name: 'True Wind Speed',
		tag:  'true_wind_speed',
	}, {
		id: '2a71',
		type: 'characteristic',
		name: 'True Wind Direction',
		tag:  'true_wind_direction',
	}, {
		id: '2a72',
		type: 'characteristic',
		name: 'Apparent Wind Speed',
		tag:  'apparent_wind_speed',
	}, {
		id: '2a73',
		type: 'characteristic',
		name: 'Apparent Wind Direction',
		tag:  'apparent_wind_direction',
	}, {
		id: '2a74',
		type: 'characteristic',
		name: 'Gust Factor',
		tag:  'gust_factor',
	}, {
		id: '2a75',
		type: 'characteristic',
		name: 'Pollen Concentration',
		tag:  'pollen_concentration',
	}, {
		id: '2a76',
		type: 'characteristic',
		name: 'UV Index',
		tag:  'uv_index',
	}, {
		id: '2a77',
		type: 'characteristic',
		name: 'Irradiance',
		tag:  'irradiance',
	}, {
		id: '2a78',
		type: 'characteristic',
		name: 'Rainfall',
		tag:  'rainfall',
	}, {
		id: '2a79',
		type: 'characteristic',
		name: 'Wind Chill',
		tag:  'wind_chill',
	}, {
		id: '2a7a',
		type: 'characteristic',
		name: 'Heat Index',
		tag:  'heat_index',
	}, {
		id: '2a7b',
		type: 'characteristic',
		name: 'Dew Point',
		tag:  'dew_point',
	}, {
		id: '2a7d',
		type: 'characteristic',
		name: 'Descriptor Value Changed',
		tag:  'descriptor_value_changed',
	}, {
		id: '2a7e',
		type: 'characteristic',
		name: 'Aerobic Heart Rate Lower Limit',
		tag:  'aerobic_heart_rate_lower_limit',
	}, {
		id: '2a7f',
		type: 'characteristic',
		name: 'Aerobic Threshold',
		tag:  'aerobic_threshold',
	}, {
		id: '2a80',
		type: 'characteristic',
		name: 'Age',
		tag:  'age',
	}, {
		id: '2a81',
		type: 'characteristic',
		name: 'Anaerobic Heart Rate Lower Limit',
		tag:  'anaerobic_heart_rate_lower_limit',
	}, {
		id: '2a82',
		type: 'characteristic',
		name: 'Anaerobic Heart Rate Upper Limit',
		tag:  'anaerobic_heart_rate_upper_limit',
	}, {
		id: '2a83',
		type: 'characteristic',
		name: 'Anaerobic Threshold',
		tag:  'anaerobic_threshold',
	}, {
		id: '2a84',
		type: 'characteristic',
		name: 'Aerobic Heart Rate Upper Limit',
		tag:  'aerobic_heart_rate_upper_limit',
	}, {
		id: '2a85',
		type: 'characteristic',
		name: 'Date of Birth',
		tag:  'date_of_birth',
	}, {
		id: '2a86',
		type: 'characteristic',
		name: 'Date of Threshold Assessment',
		tag:  'date_of_threshold_assessment',
	}, {
		id: '2a87',
		type: 'characteristic',
		name: 'Email Address',
		tag:  'email_address',
	}, {
		id: '2a88',
		type: 'characteristic',
		name: 'Fat Burn Heart Rate Lower Limit',
		tag:  'fat_burn_heart_rate_lower_limit',
	}, {
		id: '2a89',
		type: 'characteristic',
		name: 'Fat Burn Heart Rate Upper Limit',
		tag:  'fat_burn_heart_rate_upper_limit',
	}, {
		id: '2a8a',
		type: 'characteristic',
		name: 'First Name',
		tag:  'first_name',
	}, {
		id: '2a8b',
		type: 'characteristic',
		name: 'Five Zone Heart Rate Limits',
		tag:  'five_zone_heart_rate_limits',
	}, {
		id: '2a8c',
		type: 'characteristic',
		name: 'Gender',
		tag:  'gender',
	}, {
		id: '2a8d',
		type: 'characteristic',
		name: 'Heart Rate Max',
		tag:  'heart_rate_max',
	}, {
		id: '2a8e',
		type: 'characteristic',
		name: 'Height',
		tag:  'height',
	}, {
		id: '2a8f',
		type: 'characteristic',
		name: 'Hip Circumference',
		tag:  'hip_circumference',
	}, {
		id: '2a90',
		type: 'characteristic',
		name: 'Last Name',
		tag:  'last_name',
	}, {
		id: '2a91',
		type: 'characteristic',
		name: 'Maximum Recommended Heart Rate',
		tag:  'maximum_recommended_heart_rate',
	}, {
		id: '2a92',
		type: 'characteristic',
		name: 'Resting Heart Rate',
		tag:  'resting_heart_rate',
	}, {
		id: '2a93',
		type: 'characteristic',
		name: 'Sport Type for Aerobic and Anaerobic Thresholds',
		tag:  'sport_type_for_aerobic_and_anaerobic_thresholds',
	}, {
		id: '2a94',
		type: 'characteristic',
		name: 'Three Zone Heart Rate Limits',
		tag:  'three_zone_heart_rate_limits',
	}, {
		id: '2a95',
		type: 'characteristic',
		name: 'Two Zone Heart Rate Limit',
		tag:  'two_zone_heart_rate_limit',
	}, {
		id: '2a96',
		type: 'characteristic',
		name: 'VO2 Max',
		tag:  'vo2_max',
	}, {
		id: '2a97',
		type: 'characteristic',
		name: 'Waist Circumference',
		tag:  'waist_circumference',
	}, {
		id: '2a98',
		type: 'characteristic',
		name: 'Weight',
		tag:  'weight',
	}, {
		id: '2a99',
		type: 'characteristic',
		name: 'Database Change Increment',
		tag:  'database_change_increment',
	}, {
		id: '2a9a',
		type: 'characteristic',
		name: 'User Index',
		tag:  'user_index',
	}, {
		id: '2a9b',
		type: 'characteristic',
		name: 'Body Composition Feature',
		tag:  'body_composition_feature',
	}, {
		id: '2a9c',
		type: 'characteristic',
		name: 'Body Composition Measurement',
		tag:  'body_composition_measurement',
	}, {
		id: '2a9d',
		type: 'characteristic',
		name: 'Weight Measurement',
		tag:  'weight_measurement',
	}, {
		id: '2a9e',
		type: 'characteristic',
		name: 'Weight Scale Feature',
		tag:  'weight_scale_feature',
	}, {
		id: '2a9f',
		type: 'characteristic',
		name: 'User Control Point',
		tag:  'user_control_point',
	}, {
		id: '2aa0',
		type: 'characteristic',
		name: 'Magnetic Flux Density - 2D',
		tag:  'Magnetic_flux_density_2D',
	}, {
		id: '2aa1',
		type: 'characteristic',
		name: 'Magnetic Flux Density - 3D',
		tag:  'Magnetic_flux_density_3D',
	}, {
		id: '2aa2',
		type: 'characteristic',
		name: 'Language',
		tag:  'language',
	}, {
		id: '2aa3',
		type: 'characteristic',
		name: 'Barometric Pressure Trend',
		tag:  'barometric_pressure_trend',
	}, {
		id: '2aa4',
		type: 'characteristic',
		name: 'Bond Management Control Point',
		tag:  'bond_management_control_point',
	}, {
		id: '2aa5',
		type: 'characteristic',
		name: 'Bond Management Features',
		tag:  'bond_management_feature',
	}, {
		id: '2aa7',
		type: 'characteristic',
		name: 'CGM Measurement',
		tag:  'cgm_measurement',
	}, {
		id: '2aa8',
		type: 'characteristic',
		name: 'CGM Feature',
		tag:  'cgm_feature',
	}, {
		id: '2aa9',
		type: 'characteristic',
		name: 'CGM Status',
		tag:  'cgm_status',
	}, {
		id: '2aaa',
		type: 'characteristic',
		name: 'CGM Session Start Time',
		tag:  'cgm_session_start_time',
	}, {
		id: '2aab',
		type: 'characteristic',
		name: 'CGM Session Run Time',
		tag:  'cgm_session_run_time',
	}, {
		id: '2aac',
		type: 'characteristic',
		name: 'CGM Specific Ops Control Point',
		tag:  'cgm_specific_ops_control_point',
	}, {
		id: '2aad',
		type: 'characteristic',
		name: 'Indoor Positioning Configuration',
		tag:  'indoor_positioning_configuration',
	}, {
		id: '2aae',
		type: 'characteristic',
		name: 'Latitude',
		tag:  'latitude',
	}, {
		id: '2aaf',
		type: 'characteristic',
		name: 'Longitude',
		tag:  'Longitude',
	}, {
		id: '2ab0',
		type: 'characteristic',
		name: 'Local North Coordinate',
		tag:  'local_north_coordinate',
	}, {
		id: '2ab1',
		type: 'characteristic',
		name: 'Local East Coordinate',
		tag:  'local_east_coordinate',
	}, {
		id: '2ab2',
		type: 'characteristic',
		name: 'Floor Number',
		tag:  'floor_number',
	}, {
		id: '2ab3',
		type: 'characteristic',
		name: 'Altitude',
		tag:  'altitude',
	}, {
		id: '2ab4',
		type: 'characteristic',
		name: 'Uncertainty',
		tag:  'uncertainty',
	}, {
		id: '2ab5',
		type: 'characteristic',
		name: 'Location Name',
		tag:  'location_name',
	}, {
		id: '2ab6',
		type: 'characteristic',
		name: 'URI',
		tag:  'uri',
	}, {
		id: '2ab7',
		type: 'characteristic',
		name: 'HTTP Headers',
		tag:  'http_headers',
	}, {
		id: '2ab8',
		type: 'characteristic',
		name: 'HTTP Status Code',
		tag:  'http_status_code',
	}, {
		id: '2ab9',
		type: 'characteristic',
		name: 'HTTP Entity Body',
		tag:  'http_entity_body',
	}, {
		id: '2aba',
		type: 'characteristic',
		name: 'HTTP Control Point',
		tag:  'http_control_point',
	}, {
		id: '2abb',
		type: 'characteristic',
		name: 'HTTPS Security',
		tag:  'https_security',
	}, {
		id: '2abc',
		type: 'characteristic',
		name: 'TDS Control Point',
		tag:  'tds_control_point',
	}, {
		id: '2abd',
		type: 'characteristic',
		name: 'OTS Feature',
		tag:  'ots_feature',
	}, {
		id: '2abe',
		type: 'characteristic',
		name: 'Object Name',
		tag:  'object_name',
	}, {
		id: '2abf',
		type: 'characteristic',
		name: 'Object Type',
		tag:  'object_type',
	}, {
		id: '2ac0',
		type: 'characteristic',
		name: 'Object Size',
		tag:  'object_size',
	}, {
		id: '2ac1',
		type: 'characteristic',
		name: 'Object First-Created',
		tag:  'object_first_created',
	}, {
		id: '2ac2',
		type: 'characteristic',
		name: 'Object Last-Modified',
		tag:  'object_last_modified',
	}, {
		id: '2ac3',
		type: 'characteristic',
		name: 'Object ID',
		tag:  'object_id',
	}, {
		id: '2ac4',
		type: 'characteristic',
		name: 'Object Properties',
		tag:  'object_properties',
	}, {
		id: '2ac5',
		type: 'characteristic',
		name: 'Object Action Control Point',
		tag:  'object_action_control_point',
	}, {
		id: '2ac6',
		type: 'characteristic',
		name: 'Object List Control Point',
		tag:  'object_list_control_point',
	}, {
		id: '2ac7',
		type: 'characteristic',
		name: 'Object List Filter',
		tag:  'object_list_filter',
	}, {
		id: '2ac8',
		type: 'characteristic',
		name: 'Object Changed',
		tag:  'object_changed',
	}, {
		id: '2acc',
		type: 'characteristic',
		name: 'Fitness Machine Feature',
		tag:  'fitness_machine_feature',
	}, {
		id: '2acd',
		type: 'characteristic',
		name: 'Treadmill Data',
		tag:  'treadmill_data',
	}, {
		id: '2ace',
		type: 'characteristic',
		name: 'Cross Trainer Data',
		tag:  'cross_trainer_data',
	}, {
		id: '2acf',
		type: 'characteristic',
		name: 'Step Climber Data',
		tag:  'step_climber_data',
	}, {
		id: '2ad0',
		type: 'characteristic',
		name: 'Stair Climber Data',
		tag:  'stair_climber_data',
	}, {
		id: '2ad1',
		type: 'characteristic',
		name: 'Rower Data',
		tag:  'rower_data',
	}, {
		id: '2ad2',
		type: 'characteristic',
		name: 'Indoor Bike Data',
		tag:  'indoor_bike_data',
	}, {
		id: '2ad3',
		type: 'characteristic',
		name: 'Training Status',
		tag:  'training_status',
	}, {
		id: '2ad4',
		type: 'characteristic',
		name: 'Supported Speed Range',
		tag:  'supported_speed_range',
	}, {
		id: '2ad5',
		type: 'characteristic',
		name: 'Supported Inclination Range',
		tag:  'supported_inclination_range',
	}, {
		id: '2ad6',
		type: 'characteristic',
		name: 'Supported Resistance Level Range',
		tag:  'supported_resistance_level_range',
	}, {
		id: '2ad7',
		type: 'characteristic',
		name: 'Supported Heart Rate Range',
		tag:  'supported_heart_rate_range',
	}, {
		id: '2ad8',
		type: 'characteristic',
		name: 'Supported Power Range',
		tag:  'supported_power_range',
	}, {
		id: '2ad9',
		type: 'characteristic',
		name: 'Fitness Machine Control Point',
		tag:  'fitness_machine_control_point',
	}, {
		id: '2ada',
		type: 'characteristic',
		name: 'Fitness Machine Status',
		tag:  'fitness_machine_status',
	}, {
		id: '2b1d',
		type: 'characteristic',
		name: 'RC Feature',
		tag:  'rc_feature',
	}, {
		id: '2b1e',
		type: 'characteristic',
		name: 'RC Settings',
		tag:  'rc_settings',
	}, {
		id: '2b1f',
		type: 'characteristic',
		name: 'Reconnection Configuration Control Point',
		tag:  'reconnection_configuration_control_point',
	}
]