import { LaptopSpecUniq, LaptopsSpec, SmartphonesSpec, SmartphonesSpecUniq, TabletSpec, TabletSpecUniq } from "../TypeModels";

export function getDefaultSmartUniq(status: boolean): SmartphonesSpecUniq {
    return {
        battery_capacity: status,
        battery_technology: status,
        camera_back__mp: status,
        camera_front__mp: status,
        color: status,
        cpu_number_of_cores: status,
        cpu_type: status,
        display_size_inch: status,
        display_type: status,
        general_brand: status,
        general_year: status,
        info: status,
        mpn: status,
        name: status,
        ram_capacity_gb: status,
        software_os: status,
        storage_capacity_gb: status
    };
}
export function getDefaultTabletUniq(status: boolean): TabletSpecUniq {
    return {
        back_camera: status,
        battery_capacity: status,
        battery_type: status,
        brand: status,
        color: status,
        date_released: status,
        display_diagonal: status,
        display_type: status,
        front_camera: status,
        mpn: status,
        name: status,
        processor_cpu: status,
        ram_capacity: status,
        software_os: status,
        software_os_version: status,
        storage_capacity: status,
        weight: status,
    };
}
export function getDefaultLaptopUniq(status: boolean): LaptopSpecUniq {
    return {
        battery_capacity: status,
        bluetooth_version: status,
        camera_front_mp: status,
        camera_type: status,
        color: status,
        cpu_number_of_cores: status,
        cpu_type: status,
        display_hd_type: status,
        display_size_inch: status,
        display_technology: status,
        general_brand: status,
        general_year: status,
        generation: status,
        info: status,
        max_ram_capacity_gb: status,
        mpn: status,
        number_of_hdmi: status,
        number_of_usb_ports: status,
        ram_capacity_gb: status,
        software_os: status,
        ssd_capacity_gb: status,
        storage_type: status,
        type_ram: status,
    };
}

export function getDiffSmartphones(smartphonesSpec: Array<SmartphonesSpec>): SmartphonesSpecUniq {
    let newDataUniq: SmartphonesSpecUniq = getDefaultSmartUniq(true);
    let smartValues: SmartphonesSpec;
    smartphonesSpec.forEach(item => {
        if (smartValues == undefined) {
            smartValues = {
                ID: item.ID,
                battery_capacity: item.battery_capacity,
                battery_technology: item.battery_technology,
                camera_back__mp: item.camera_back__mp,
                camera_front__mp: item.camera_front__mp,
                color: item.color,
                cpu_number_of_cores: item.cpu_number_of_cores,
                cpu_type: item.cpu_type,
                display_size_inch: item.display_size_inch,
                display_type: item.display_type,
                general_brand: item.general_brand,
                general_year: item.general_year,
                info: item.info,
                mpn: item.mpn,
                name: item.name,
                ram_capacity_gb: item.ram_capacity_gb,
                software_os: item.software_os,
                storage_capacity_gb: item.storage_capacity_gb
            }
        } else {
            for (const [key] of Object.entries(newDataUniq)) {
                // console.log("Object.entries",key);
                
                if (newDataUniq[key as keyof SmartphonesSpecUniq]) {
                    newDataUniq[key as keyof SmartphonesSpecUniq] = (smartValues[key as keyof SmartphonesSpec] == item[key as keyof SmartphonesSpec])
                    console.log(key + " " + smartValues[key as keyof SmartphonesSpec] + " == " + item[key as keyof SmartphonesSpec] + " = " + newDataUniq[key as keyof SmartphonesSpecUniq]);
                }
            }
        }
    });
    return newDataUniq;
}

export function getDiffLaptop(smartphonesSpec: Array<LaptopsSpec>): LaptopSpecUniq {
    let newDataUniq: LaptopSpecUniq = getDefaultLaptopUniq(true);
    let smartValues: LaptopsSpec;
    smartphonesSpec.forEach(item => {
        if (smartValues == undefined) {
            smartValues = {
                ID: item.ID,
                battery_capacity: item.battery_capacity,
                bluetooth_version: item.bluetooth_version,
                camera_front_mp: item.camera_front_mp,
                camera_type: item.camera_type,
                color: item.color,
                cpu_number_of_cores: item.cpu_number_of_cores,
                cpu_type: item.cpu_type,
                display_hd_type: item.display_hd_type,
                display_size_inch: item.display_size_inch,
                display_technology: item.display_technology,
                general_brand: item.general_brand,
                general_year: item.general_year,
                generation: item.generation,
                info: item.info,
                max_ram_capacity_gb: item.max_ram_capacity_gb,
                mpn: item.mpn,
                number_of_hdmi: item.number_of_hdmi,
                number_of_usb_ports: item.number_of_usb_ports,
                ram_capacity_gb: item.ram_capacity_gb,
                software_os: item.software_os,
                ssd_capacity_gb: item.ssd_capacity_gb,
                storage_type: item.storage_type,
                type_ram: item.type_ram
            }
        } else {
            for (const [key] of Object.entries(newDataUniq)) {
                if (newDataUniq[key as keyof LaptopSpecUniq]) {
                    newDataUniq[key as keyof LaptopSpecUniq] = (smartValues[key as keyof LaptopsSpec] == item[key as keyof LaptopsSpec])
                    console.log(key + " " + smartValues[key as keyof LaptopsSpec] + " != " + item[key as keyof LaptopsSpec] + " = " + newDataUniq[key as keyof LaptopSpecUniq]);
                }
            }
        }
    });
    return newDataUniq;
}

export function getDiffTablet(smartphonesSpec: Array<TabletSpec>): TabletSpecUniq {
    let newDataUniq: TabletSpecUniq = getDefaultTabletUniq(true);
    let smartValues: TabletSpec;
    smartphonesSpec.forEach(item => {
        if (smartValues == undefined) {
            smartValues = {
                ID: item.ID,
                back_camera: item.back_camera,
                battery_capacity: item.battery_capacity,
                battery_type: item.battery_type,
                brand: item.brand,
                color: item.color,
                date_released: item.date_released,
                display_diagonal: item.display_diagonal,
                display_type: item.display_type,
                front_camera: item.front_camera,
                mpn: item.mpn,
                name: item.name,
                processor_cpu: item.processor_cpu,
                ram_capacity: item.ram_capacity,
                software_os: item.software_os,
                software_os_version: item.software_os_version,
                storage_capacity: item.storage_capacity,
                weight: item.weight
            }
        } else {
            for (const [key] of Object.entries(newDataUniq)) {
                if (newDataUniq[key as keyof TabletSpecUniq]) {
                    newDataUniq[key as keyof TabletSpecUniq] = (smartValues[key as keyof TabletSpec] == item[key as keyof TabletSpec])
                    console.log(key + " " + smartValues[key as keyof TabletSpec] + " != " + item[key as keyof TabletSpec] + " = " + newDataUniq[key as keyof TabletSpecUniq]);
                }
            }
        }
    });
    return newDataUniq;
}