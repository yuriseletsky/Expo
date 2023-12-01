export type ProductType = {
    ID: number;
    Author: string;
    AuthorGuid: string;
    Description: string;
    DevCatId: number;
    IsFavorite: boolean;
    Name: string;
    PhotosItem: Array<{ ID: string, PhotoStr: string }>;
    Price: number;
    Valuta: string;
    isCompare?: boolean;
    isEdit?: boolean;
    CustomDeviceCategory: number;
};
export type LoginModel = {
    Email: string,
    Password: string,
    RememberMe: boolean
};
export type LoginResponse = {
    success: boolean,
    token: string
};
export type UserInfo = {
    fullName: string,
    email: string,
    phoneNumber: string
};
export type ProductSearchResult = {
    image: {
        back: string | null,
        front: string | null
    },
    product: {
        brand: string,
        category: string,
        id: string,
        model: string,
        version: string
    },
    versions: any
}
export type PropertyList = {
    name: string;
    value: string;
}
export type ProductSearchResults = readonly ProductSearchResult[];
export type BrandsSearch = readonly { id: number, name: string }[];
export let defaultSpec: SpecsByProduct = {
    No: { FM_Radio: "", Flash: "", GPS: "", SIM_Frequencies: "", SIM_II_Frequencies: "" },
    camera: {
        back_camera: {
            focus: "", image_format: "", resolution: "", sensor: "", video_format: "", video_resolution: "", zoom: "",
            "resolution_(h_x_w)": undefined
        },
        front_camera: { image_format: "", resolution: "", "resolution_(h_x_w)": "", sensor: "", video_format: "", video_resolution: "" }
    },
    date: { released: "" },
    design: {
        body: {
            colors: "",
            height: "",
            thickness: "",
            weight: "",
            width: ""
        },
        keyboard: { design: "" }
    },
    display: {
        bezel_width: "", color_depth: "", diagonal: "", glass: "", height: "", illumination: "", lcd_mode: "", number_of_colors: "",
        pixel_density: "",
        pixel_size: "",
        "resolution_(h_x_w)": "",
        screen_to_body_ratio: "",
        subpixels: "",
        touch_screen_type: "",
        width: ""
    },
    image: { back: "", front: "" },
    inside: {
        audio: { channel: "", microphone: "", output: "" },
        battery: { cell_i: "", style: "" },
        cellular: { generation: "", sim_type: "" },
        location: { additional_features: "" },
        port: { usb_features: "", usb_type: "", usb_version: "" },
        processor: { cpu: "", cpu_clock_speed: "", gpu: "" },
        ram: { capacity: "", type: "" },
        software: { os: "", os_version: "" },
        storage: { capacity: "", expansion: "", type: "" },
        wireless: { bluetooth_version: "", experiences: "", wifi: "" }
    },
    product: { brand: "", category: "", id: "", manufacturer: "", model: "" }
};
export type SpecsByProduct = {
    product: {
        brand: string | undefined,
        manufacturer: string | undefined,
        model: string | undefined,
        category: string | undefined,
        id: string | undefined,
    },
    image: {
        front: string | undefined,
        back: string | undefined,
    },
    date: {
        released: string | undefined,
    },
    design: {
        body: {
            height: string | undefined,
            width: string | undefined,
            weight: string | undefined,
            thickness: string | undefined,
            colors: string | undefined,
        },
        keyboard: {
            design: string | undefined,
        }
    },
    display: {
        diagonal: string | undefined,
        "resolution_(h_x_w)": string | undefined,
        pixel_density: string | undefined,
        width: string | undefined,
        height: string | undefined,
        illumination: string | undefined,
        pixel_size: string | undefined,
        color_depth: string | undefined,
        subpixels: string | undefined,
        number_of_colors: string | undefined,
        screen_to_body_ratio: string | undefined,
        bezel_width: string | undefined,
        lcd_mode: string | undefined,
        glass: string | undefined,
        touch_screen_type: string | undefined,
    },
    camera: {
        back_camera: {
            focus: string | undefined,
            resolution: string | undefined,
            "resolution_(h_x_w)": string | undefined,
            video_format: string | undefined,
            video_resolution: string | undefined,
            image_format: string | undefined,
            zoom: string | undefined,
            sensor: string | undefined,

        },
        front_camera: {
            resolution: string | undefined,
            "resolution_(h_x_w)": string | undefined,
            video_resolution: string | undefined,
            video_format: string | undefined,
            image_format: string | undefined,
            sensor: string | undefined,
        }
    },
    inside: {
        software: {
            os: string | undefined,
            os_version: string | undefined,
        },
        processor: {
            cpu: string | undefined,
            cpu_clock_speed: string | undefined,
            gpu: string | undefined,
        },
        ram: {
            type: string | undefined,
            capacity: string | undefined,
        },
        storage: {
            type: string | undefined,
            capacity: string | undefined,
            expansion: string | undefined,
        },
        audio: {
            channel: string | undefined,
            output: string | undefined,
            microphone: string | undefined,
        },
        cellular: {
            generation: string | undefined,
            sim_type: string | undefined,
        },
        wireless: {
            bluetooth_version: string | undefined,
            wifi: string | undefined,
            experiences: string | undefined,
        },
        port: {
            usb_type: string | undefined,
            usb_version: string | undefined,
            usb_features: string | undefined,
        },
        battery: {
            cell_i: string | undefined,
            style: string | undefined,
        },
        location: {
            additional_features: string | undefined,
        },
    },
    No: {
        GPS: string | undefined,
        Flash: string | undefined,
        SIM_Frequencies: string | undefined,
        SIM_II_Frequencies: string | undefined,
        FM_Radio: string | undefined,
    }
}

export type UserModel = {
    fullName: string,
    userName: string,
    userGuid: string,
    personGuid: string,
    phoneNumber: string,
    instagram: string,
    facebook: string,
    skype: string,
    description: string,
    addres: string,
    email: string,
    isActive: boolean,
    isBlocked: boolean,
    photo: {
        id:number,
        photoStr: string
    },
};
export type Filter = {
    DeviceCategoryId: string,
    Vendors: Array<string>,
    OS: Array<string>,
    DisplaySize: Array<string>,
    DisplayType: Array<string>,
    CPUType: Array<string>,
    CPUNumOfCorse: Array<string>,
    StorageCapacity: Array<string>,
    Color: Array<string>,
    Property: Array<string>,
    MinPrice: string,
    MaxPrice: string,
    Region: string,
    Sorting: string,
    Page: number,
    ItNew: any,
    ItList: boolean,
    ReqNum: number,
    RAMCapacityList: Array<string>,
}

export type Transaction = {
    id: number,
    transactionId: string,
    userName: string,
    comments: string,
    payDetailId: any,
    dateCreated: string,
    dateUpdated: string,
    total: number,
    unit: number,
    valuteSymbol: string,
    requestStatus: string,
    color: string,
}
export type CompareData = {
    products: ProductType[],
    specs: Array<any>
}
export type FilterList = {
    CPUNumOfCorseList: Array<string>,
    CPUTypeList: Array<string>,
    ColorList: Array<string>,
    DisplaySize: Array<string>,
    DisplayTypeList: Array<string>,
    MaxPrice: number,
    MinPrice: number,
    OSList: Array<string>,
    PropertiesList: Array<string>,
    RAMCapacityList: Array<string>,
    StorageCapacityList: Array<string>,
    VendorsList: Array<string>,
}

export type TabletSpec = {
    ID: number,
    author: string,
    price: number,
    valuta: string,
    back_camera: string,
    battery_capacity: string,
    battery_type: string,
    brand: string,
    color: string,
    date_released: string,
    display_diagonal: string,
    display_type: string,
    front_camera: string,
    mpn: string,
    name: string,
    processor_cpu: string,
    ram_capacity: string,
    software_os: string,
    software_os_version: string,
    storage_capacity: string,
    weight: string,
}

export type LaptopsSpec = {
    ID: number,
    author: string,
    price: number,
    valuta: string,
    battery_capacity: string,
    bluetooth_version: string,
    camera_front_mp: string,
    camera_type: string,
    color: string,
    cpu_number_of_cores: string,
    cpu_type: string,
    display_hd_type: string,
    display_size_inch: string,
    display_technology: string,
    general_brand: string,
    general_year: string,
    generation: string,
    info: string,
    max_ram_capacity_gb: string,
    mpn: string,
    number_of_hdmi: string,
    number_of_usb_ports: string,
    ram_capacity_gb: string,
    software_os: string,
    ssd_capacity_gb: string,
    storage_type: string,
    type_ram: string,
}
export type SmartphonesSpec = {
    ID: number,
    author: string,
    price: number,
    valuta: string,
    battery_capacity: string,
    battery_technology: string,
    camera_back__mp: string,
    camera_front__mp: string,
    color: string,
    cpu_number_of_cores: string,
    cpu_type: string,
    display_size_inch: string,
    display_type: string,
    general_brand: string,
    general_year: string,
    info: string,
    mpn: string,
    name: string,
    ram_capacity_gb: string,
    software_os: string,
    storage_capacity_gb: string,
}

export type SmartphonesSpecUniq = {
    author: boolean,
    price: boolean,
    valuta: boolean,
    battery_capacity: boolean,
    battery_technology: boolean,
    camera_back__mp: boolean,
    camera_front__mp: boolean,
    color: boolean,
    cpu_number_of_cores: boolean,
    cpu_type: boolean,
    display_size_inch: boolean,
    display_type: boolean,
    general_brand: boolean,
    general_year: boolean,
    info: boolean,
    mpn: boolean,
    name: boolean,
    ram_capacity_gb: boolean,
    software_os: boolean,
    storage_capacity_gb: boolean,
}

export type LaptopSpecUniq = {
    author: boolean,
    price: boolean,
    valuta: boolean,
    battery_capacity: boolean,
    bluetooth_version: boolean,
    camera_front_mp: boolean,
    camera_type: boolean,
    color: boolean,
    cpu_number_of_cores: boolean,
    cpu_type: boolean,
    display_hd_type: boolean,
    display_size_inch: boolean,
    display_technology: boolean,
    general_brand: boolean,
    general_year: boolean,
    generation: boolean,
    info: boolean,
    max_ram_capacity_gb: boolean,
    mpn: boolean,
    number_of_hdmi: boolean,
    number_of_usb_ports: boolean,
    ram_capacity_gb: boolean,
    software_os: boolean,
    ssd_capacity_gb: boolean,
    storage_type: boolean,
    type_ram: boolean,
}

export type TabletSpecUniq = {
    author: boolean,
    price: boolean,
    valuta: boolean,
    back_camera: boolean,
    battery_capacity: boolean,
    battery_type: boolean,
    brand: boolean,
    color: boolean,
    date_released: boolean,
    display_diagonal: boolean,
    display_type: boolean,
    front_camera: boolean,
    mpn: boolean,
    name: boolean,
    processor_cpu: boolean,
    ram_capacity: boolean,
    software_os: boolean,
    software_os_version: boolean,
    storage_capacity: boolean,
    weight: boolean,
}

export type Location = {
    lat: number,
    lng: number
}

export type Advert = {
    data: any,
    step: number
}

export type ProductSearch = {
    id: any;
    name: any;
    price: any;
    valuta: any;
    isNew: any;
    photosItem: Array<{ ID: string, PhotoStr: string }>;
    author: any;
    authorGuid: any;
    description: any;
}