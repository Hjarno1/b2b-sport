// src/lib/data/mock-data.ts

// User Roles
export enum UserRole {
  ClubAdmin = 'Club Admin',
  ClubStaff = 'Club Staff',
  ClubFinance = 'Club Finance',
}

// Agreement Status
export enum AgreementStatus {
  Draft = 'Draft', // Initial state when created by B2B Admin
  Pending = 'Pending', // Waiting for Club Admin approval
  Active = 'Active', // Approved by Club Admin, needs Club Staff to fill details
  InProgress = 'In Progress', // Club Staff is working on it
  Completed = 'Completed', // All details filled and submitted
  Canceled = 'Canceled', // Agreement was canceled
}

// Order Status
export enum OrderStatus {
  Pending = 'Pending', // Order created but not yet processed
  Processing = 'Processing', // Order is being prepared
  Shipped = 'Shipped', // Order has been shipped
  Delivered = 'Delivered', // Order has been delivered
  Canceled = 'Canceled', // Order was canceled
}

// User Status
export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

// Club Status
export enum ClubStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Setup = 'Setup',
}

// Player Position
export enum PlayerPosition {
  Markspiller = 'Markspiller',
  Målmand = 'Målmand',
}

// Field Type for Agreement Templates
export enum FieldType {
  Text = 'text',
  Number = 'number',
  Select = 'select',
}

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  clubId?: string;
  status: UserStatus;
  avatar: string;
  lastLogin?: string;
}

export interface Club {
  id: string;
  name: string;
  adminId?: string;
  createdAt: string;
  staffCount: number;
  activeAgreements: number;
  status: ClubStatus;
  abbreviation: string;
  color: string;
  logo?: string;
}

export interface Team {
  id: string;
  name: string;
  clubId: string;
  playerCount: number;
  type: string;
  createdAt: string;
}

export interface Player {
  id: string;
  name: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  position: PlayerPosition;
  joinedDate: string;
  clubId: string;
  teamId: string;
  image?: string;
  notes?: string;
  isActive: boolean;
}

export interface AgreementField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  description?: string;
}

export interface AgreementTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  category: string;
  fields: AgreementField[];
}

export interface Agreement {
  id: string;
  name: string;
  clubId: string;
  teamId: string;
  templateId: string;
  status: AgreementStatus;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
  priority: 'High' | 'Normal' | 'Low';
  dueDate: string;
  completionPercentage: number;
  approvedBy?: string;
  approvedDate?: string;
  file: string;
}

export interface PlayerMapping {
  id: string;
  agreementId: string;
  playerId: string;
  values: Record<string, string>;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  agreementId: string;
  clubId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  items: number;
  completedBy?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  playerCount: number;
  progress: number;
  total: number;
  products?: OrderProducts[];
  orderConfirmation?: string;
  orderInvoice?: string;
}

export interface Activity {
  id: string;
  description: string;
  timestamp: string;
  userId?: string;
  clubId?: string;
  agreementId?: string;
  orderId?: string;
  teamId?: string;
  playerId?: string;
  type: 'order' | 'agreement' | 'team' | 'user' | 'player' | 'system';
}

export interface Task {
  id: string;
  title: string;
  teamId: string;
  agreementId: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'complete' | 'overdue';
  completionPercentage: number;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
}

export interface TeamViewModel {
  id: string;
  name: string;
  playerCount: number;
  kitRequestCount: number;
  pendingCount: number;
}

// Additional mock data for kit requests view
export interface KitRequestViewModel {
  id: string;
  name: string;
  teamName: string;
  status: AgreementStatus;
  dueDate: string;
  progress: number;
  playerCount: number;
  completedCount: number;
  isRequired: boolean;
}

// Detailed order view model
export interface OrderViewModel {
  id: string;
  agreementId: string;
  clubId: string;
  teamId: string;
  teamName: string;
  kitName: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  completedBy?: string;
  items: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
  playerCount: number;
  progress: number;
}

export interface PlayerKitDetailsViewModel {
  id: string;
  name: string;
  clubId: string;
  teamId: string;
  teamName: string;
  status: AgreementStatus;
  validUntil: string;
  dueDate: string;
  fields: AgreementField[];
  playerMappings: PlayerMapping[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  sizes?: string[];
  customizable: boolean;
  description?: string;
}

export interface OrderProducts {
  id: number;
  name: string;
  price: number;
  images: string[];
  sizes?: string[];
  customizable: boolean;
  quantity: number;
  playerNumbers: number[];
}

export interface OrderItem extends Product {
  quantity: number;
  size?: string;
  numbers?: string[];
}

export interface WinnerCodeEntry {
  used: boolean;
  redeemed?: {
    token: string;
    productId: string;
    clubName: string;
    firstName: string;
    lastName: string;
    printName: string;
    date: string;
  };
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Chris Sawaguchi',
    email: 'chsa@ribehk.dk',
    password: 'password123',
    phone: '+45 20 12 02 24',
    role: UserRole.ClubStaff,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/faces/chris-sawaguchi.jpg',
    lastLogin: '16 April, 2025, 8:42',
  },
  {
    id: 'user-002',
    name: 'Gitte Langmach Jacobsen',
    email: 'glj@langmachribe.dk',
    password: 'password123',
    phone: '+45 23 31 84 82',
    role: UserRole.ClubAdmin,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/faces/gitte-jacobsen.jpg',
    lastLogin: '26 April, 2025, 9:15',
  },
  {
    id: 'user-003',
    name: 'Martin Wolf Andersen',
    email: 'maan@rhk.dk',
    password: 'password123',
    phone: '+45 60 17 70 20',
    role: UserRole.ClubStaff,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/faces/martin-wolf-andersen.jpg',
    lastLogin: '21 Juni, 2025, 13:53',
  },
  {
    id: 'user-004',
    name: 'Kasserer Ribe HK',
    email: 'v.andersen@stofanet.dk',
    password: 'password123',
    phone: '+45 30 12 34 56',
    role: UserRole.ClubFinance,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/clubs/ribehk.png',
    lastLogin: '1 Maj, 2025, 12:42 PM',
  },
  {
    id: 'user-005',
    name: 'Preben Andersen',
    email: 'pa@rehh.dk',
    password: 'password123',
    phone: '+45 40 54 12 88',
    role: UserRole.ClubStaff,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/faces/default-avatar.jpg',
    lastLogin: '23 Maj, 2025, 10:17',
  },
  {
    id: 'user-006',
    name: 'Signe Konradsen',
    email: 'signekonradsen@gmail.com',
    password: 'password123',
    phone: '+45 12 34 56 78',
    role: UserRole.ClubStaff,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/faces/default-avatar.jpg',
    lastLogin: '3 Juli, 2025, 12:15',
  },
];

// Mock Clubs
export const mockClubs: Club[] = [
  {
    id: 'club-001',
    name: 'Ribe HK',
    adminId: 'user-003',
    createdAt: 'Jan 15, 2025',
    staffCount: 8,
    activeAgreements: 2,
    status: ClubStatus.Active,
    abbreviation: 'RHK',
    color: '#4a86e8',
    logo: '/clubs/ribehk.png',
  },
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: 'team-001',
    name: 'Lykkeliga Ribe Blues',
    clubId: 'club-001',
    playerCount: 10,
    type: 'Blandet hold',
    createdAt: 'Jan 15, 2025',
  },
  {
    id: 'team-002',
    name: 'U6 og U7 Drenge / Piger',
    clubId: 'club-001',
    playerCount: 12,
    type: 'Blandet hold',
    createdAt: 'Jan 15, 2025',
  },
  {
    id: 'team-003',
    name: 'U8 og U9 Drenge',
    clubId: 'club-001',
    playerCount: 14,
    type: 'Drenge hold',
    createdAt: 'Feb 01, 2025',
  },
  {
    id: 'team-004',
    name: 'U8 og U9 Piger',
    clubId: 'club-001',
    playerCount: 18,
    type: 'Pige hold',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'team-005',
    name: 'U11 Piger',
    clubId: 'club-001',
    playerCount: 15,
    type: 'Pige hold',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'team-006',
    name: 'U11 Drenge',
    clubId: 'club-001',
    playerCount: 14,
    type: 'Drenge hold',
    createdAt: 'Feb 01, 2025',
  },
  {
    id: 'team-007',
    name: 'U13 Piger',
    clubId: 'club-001',
    playerCount: 18,
    type: 'Pige hold',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'team-008',
    name: 'U13 Drenge',
    clubId: 'club-001',
    playerCount: 14,
    type: 'Drenge hold',
    createdAt: 'Feb 01, 2025',
  },
  {
    id: 'team-009',
    name: 'U15 Piger',
    clubId: 'club-001',
    playerCount: 18,
    type: 'Pige hold',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'team-010',
    name: 'U15 Drenge',
    clubId: 'club-001',
    playerCount: 14,
    type: 'Drenge hold',
    createdAt: 'Feb 01, 2025',
  },
  {
    id: 'team-011',
    name: 'Serie 3 damer',
    clubId: 'club-001',
    playerCount: 18,
    type: 'Pige hold',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'team-012',
    name: 'U17 Drenge',
    clubId: 'club-001',
    playerCount: 14,
    type: 'Drenge hold',
    createdAt: 'Feb 01, 2025',
  },
  {
    id: 'team-013',
    name: 'U17 Piger',
    clubId: 'club-001',
    playerCount: 18,
    type: 'Pige hold',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'team-014',
    name: 'U19 Drenge',
    clubId: 'club-001',
    playerCount: 14,
    type: 'Drenge hold',
    createdAt: 'Feb 01, 2025',
  },
  {
    id: 'team-015',
    name: 'U19 piger',
    clubId: 'club-001',
    playerCount: 18,
    type: 'Pige hold',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'team-016',
    name: '3. division herrer',
    clubId: 'club-001',
    playerCount: 14,
    type: 'Drenge hold',
    createdAt: 'Feb 01, 2025',
  },
  {
    id: 'team-017',
    name: 'Herresenior (serie 1)',
    clubId: 'club-001',
    playerCount: 18,
    type: 'Drenge hold',
    createdAt: 'Feb 20, 2025',
  },
];

// Mock Players
export const mockPlayers: Player[] = [
  {
    id: 'player-001',
    name: 'Lasse Vigsø Lynddahl',
    dateOfBirth: '2009-02-13',
    email: 'lasse.lynddahl@email.com',
    phone: '+45 51 81 21 08',
    position: PlayerPosition.Markspiller,
    joinedDate: '2015-08-15',
    clubId: 'club-001',
    teamId: 'team-001',
    image: '/faces/lasse-vigsø-lynddahl.jpg',
    isActive: true,
  },
  {
    id: 'player-002',
    name: 'Niklas Kraft',
    dateOfBirth: '2000-04-23',
    email: 'Niklas.Kraft@email.com',
    phone: '+45 12 34 56 78',
    position: PlayerPosition.Målmand,
    joinedDate: '2022-05-22',
    clubId: 'club-001',
    teamId: 'team-001',
    image: '/faces/niklas-kraft.png',
    isActive: true,
  },
];

// Mock Agreement Fields for Templates
export const mockAgreementFields: AgreementField[] = [
  {
    id: 'jersey-number',
    name: 'Jersey Number',
    type: FieldType.Number,
    required: true,
    description: 'Player jersey number (1-99)',
  },
  {
    id: 'jersey-name',
    name: 'Name on Jersey',
    type: FieldType.Text,
    required: true,
    description: 'Name to print on the back of the jersey',
  },
  {
    id: 'jersey-size',
    name: 'Jersey Size',
    type: FieldType.Select,
    required: true,
    options: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'Jersey size',
  },
  {
    id: 'shorts-size',
    name: 'Shorts Size',
    type: FieldType.Select,
    required: true,
    options: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'Shorts size',
  },
  {
    id: 'socks-size',
    name: 'Socks Size',
    type: FieldType.Select,
    required: true,
    options: ['S (3-6)', 'M (7-9)', 'L (10-13)'],
    description: 'Socks size',
  },
  {
    id: 'additional-gear',
    name: 'Additional Equipment',
    type: FieldType.Select,
    required: false,
    options: ['None', 'Training Jacket', 'Training Pants', 'Goalkeeper Gloves'],
    description: 'Optional additional equipment',
  },
];

// Mock Agreement Templates
export const mockAgreementTemplates: AgreementTemplate[] = [
  {
    id: 'template-001',
    name: '2025 Team Kit',
    description: 'Complete team uniform package including jerseys, shorts, and socks',
    createdAt: 'Apr 10, 2025',
    category: 'Uniforms',
    fields: mockAgreementFields,
  },
  {
    id: 'template-002',
    name: 'Training Equipment',
    description: 'Training equipment including cones, balls, and practice jerseys',
    createdAt: 'Mar 15, 2025',
    category: 'Equipment',
    fields: mockAgreementFields.filter((f) =>
      ['jersey-size', 'shorts-size', 'additional-gear'].includes(f.id),
    ),
  },
  {
    id: 'template-003',
    name: 'Goalkeeper Specialized Kit',
    description: 'Specialized goalkeeper equipment and uniform package',
    createdAt: 'Feb 28, 2025',
    category: 'Uniforms',
    fields: [
      ...mockAgreementFields,
      {
        id: 'glove-size',
        name: 'Glove Size',
        type: FieldType.Select,
        required: true,
        options: ['7', '8', '9', '10', '11'],
        description: 'Goalkeeper glove size',
      },
    ],
  },
  {
    id: 'template-004',
    name: 'Youth Development Package',
    description: 'Youth-sized equipment and uniforms for development programs',
    createdAt: 'Jan 20, 2025',
    category: 'Youth',
    fields: mockAgreementFields,
  },
];

// Mock Agreements
export const mockAgreements: Agreement[] = [
  {
    id: 'AGR-001245',
    name: 'U17 Drenge Spillertrøjer 2025/26',
    clubId: 'club-001',
    teamId: 'team-012',
    templateId: 'template-001',
    status: AgreementStatus.Active,
    createdAt: '1. Maj, 2025',
    updatedAt: '4. Maj, 2025',
    validUntil: '1. Juni, 2025',
    priority: 'Normal',
    dueDate: '25. Juni, 2025',
    completionPercentage: 50,
    approvedBy: 'user-003',
    approvedDate: '4. Maj, 2025',
    file: 'Samhandelsaftale_B2B_Sport_TEST_EXAMPLE.pdf',
  },
  {
    id: 'AGR-001246',
    name: 'U19 Piger Spillertrøjer 2025/26',
    clubId: 'club-001',
    teamId: 'team-015',
    templateId: 'template-002',
    status: AgreementStatus.Pending,
    createdAt: '1. Maj, 2025',
    updatedAt: '4. Maj, 2025',
    validUntil: '1. Juni, 2025',
    priority: 'Low',
    dueDate: '25. Juni, 2025',
    completionPercentage: 0,
    file: 'Samhandelsaftale_B2B_Sport_TEST_EXAMPLE.pdf',
  },
  {
    id: 'AGR-00100',
    name: 'Trade Agreement',
    clubId: 'club-001',
    teamId: '',
    templateId: 'template-002',
    status: AgreementStatus.Active,
    createdAt: '1. Maj, 2025',
    updatedAt: '4. Maj, 2025',
    validUntil: '29. April, 2025',
    priority: 'Normal',
    dueDate: '29. April, 2025',
    completionPercentage: 0,
    file: 'Samhandelsaftale_B2B_Sport_TEST_EXAMPLE.pdf',
  },
];

// Mock Player Mappings
export const mockPlayerMappings: PlayerMapping[] = [
  {
    id: 'mapping-001',
    agreementId: 'AGR-001245',
    playerId: 'player-001',
    values: {
      'jersey-number': '10',
      'jersey-name': 'LYNDDAHL',
      'jersey-size': 'S',
      'shorts-size': 'S',
      'socks-size': 'M (7-9)',
      'additional-gear': 'Training Jacket',
    },
    isComplete: true,
    createdAt: 'Apr 16, 2025',
    updatedAt: 'Apr 16, 2025',
  },
  {
    id: 'mapping-002',
    agreementId: 'AGR-001245',
    playerId: 'player-002',
    values: {
      'jersey-number': '1',
      'jersey-name': 'KRAFT',
      'jersey-size': 'M',
      'shorts-size': '', // Incomplete
      'socks-size': '', // Incomplete
      'additional-gear': '',
    },
    isComplete: false,
    createdAt: 'Apr 16, 2025',
    updatedAt: 'Apr 16, 2025',
  },
  {
    id: 'mapping-003',
    agreementId: 'AGR-001246',
    playerId: 'player-003',
    values: {
      'jersey-number': '4',
      'jersey-name': 'MADSEN',
      'jersey-size': 'S',
      'shorts-size': 'S',
      'socks-size': 'M (7-9)',
      'additional-gear': '',
    },
    isComplete: true,
    createdAt: 'Apr 10, 2025',
    updatedAt: 'Apr 15, 2025',
  },
  {
    id: 'mapping-004',
    agreementId: 'AGR-001244',
    playerId: 'player-010',
    values: {
      'jersey-number': '9',
      'jersey-name': 'JENSEN',
      'jersey-size': 'L',
      'shorts-size': 'M',
      'socks-size': 'L (10-13)',
      'additional-gear': 'Training Jacket',
    },
    isComplete: true,
    createdAt: 'Apr 13, 2025',
    updatedAt: 'Apr 13, 2025',
  },
  {
    id: 'mapping-005',
    agreementId: 'AGR-001244',
    playerId: 'player-011',
    values: {
      'jersey-number': '14',
      'jersey-name': 'MØLLER',
      'jersey-size': 'M',
      'shorts-size': 'M',
      'socks-size': '', // Incomplete
      'additional-gear': '',
    },
    isComplete: false,
    createdAt: 'Apr 13, 2025',
    updatedAt: 'Apr 13, 2025',
  },
];

// Mock Order Products
export const mockOrderProducts: OrderProducts[] = [
  {
    id: 1,
    name: 'Hjemmebane Spillertrøje',
    price: 180,
    images: ['rhk-spillertrøje-front.jpg', 'rhk-spillertrøje-bagside.jpg'],
    sizes: ['XS', 'S'],
    customizable: true,
    quantity: 2,
    playerNumbers: [4, 6],
  },
  {
    id: 2,
    name: 'Hjemmebane Spillertrøje',
    price: 270,
    images: ['rhk-spillertrøje-front.jpg', 'rhk-spillertrøje-bagside.jpg'],
    sizes: ['M'],
    customizable: true,
    quantity: 3,
    playerNumbers: [10, 11, 12],
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'ORD-2458',
    agreementId: 'AGR-001243',
    clubId: 'club-001',
    teamId: 'team-003',
    createdAt: 'Apr 15, 2025',
    updatedAt: 'Apr 16, 2025',
    status: OrderStatus.Processing,
    items: 6,
    estimatedDelivery: 'Apr 26, 2025',
    playerCount: 2,
    progress: 40,
    total: 2150,
    products: [
      mockOrderProducts.find((product) => product.id == 1)!,
      mockOrderProducts.find((product) => product.id == 2)!,
    ],
    orderConfirmation: 'Order_confirmation_73861_TEST_EXAMPLE.pdf',
    orderInvoice: 'Invoice_10700_TEST_EXAMPLE.pdf',
  },
  {
    id: 'ORD-2457',
    agreementId: 'AGR-001244',
    clubId: 'club-001',
    teamId: 'team-004',
    createdAt: 'Apr 14, 2025',
    updatedAt: 'Apr 15, 2025',
    status: OrderStatus.Shipped,
    items: 36,
    estimatedDelivery: 'Apr 20, 2025',
    trackingNumber: 'TRK123456789',
    playerCount: 12,
    progress: 75,
    total: 13450,
    products: [
      mockOrderProducts.find((product) => product.id == 1)!,
      mockOrderProducts.find((product) => product.id == 2)!,
    ],
    orderConfirmation: 'Order_confirmation_73861_TEST_EXAMPLE.pdf',
    orderInvoice: 'Invoice_10700_TEST_EXAMPLE.pdf',
  },
  {
    id: 'ORD-2456',
    agreementId: 'AGR-001242',
    clubId: 'club-001',
    teamId: 'team-005',
    createdAt: 'Mar 25, 2025',
    updatedAt: 'Apr 10, 2025',
    status: OrderStatus.Delivered,
    items: 42,
    completedBy: 'user-003',
    playerCount: 14,
    progress: 100,
    total: 22340,
    products: [
      mockOrderProducts.find((product) => product.id == 1)!,
      mockOrderProducts.find((product) => product.id == 2)!,
    ],
    orderConfirmation: 'Order_confirmation_73861_TEST_EXAMPLE.pdf',
    orderInvoice: 'Invoice_10700_TEST_EXAMPLE.pdf',
  },
  {
    id: 'ORD-2459',
    agreementId: 'AGR-001244',
    clubId: 'club-001',
    teamId: 'team-004',
    createdAt: 'Apr 14, 2025',
    updatedAt: 'Apr 15, 2025',
    status: OrderStatus.Processing,
    items: 5,
    estimatedDelivery: 'Apr 20, 2025',
    trackingNumber: 'TRK123456789',
    playerCount: 12,
    progress: 75,
    total: 13450,
    products: [
      mockOrderProducts.find((product) => product.id == 1)!,
      mockOrderProducts.find((product) => product.id == 2)!,
    ],
    orderConfirmation: 'Order_confirmation_73861_TEST_EXAMPLE.pdf',
    orderInvoice: 'Invoice_10700_TEST_EXAMPLE.pdf',
  },
];

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  fileUrl: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    date: '01/12-2024',
    amount: 'DKK 1,200.00',
    status: 'Paid',
    fileUrl: 'Invoice_10700_TEST_EXAMPLE.pdf',
  },
  {
    id: 'INV-002',
    date: '01/06-2025',
    amount: 'DKK 950.00',
    status: 'Overdue',
    fileUrl: 'Invoice_10700_TEST_EXAMPLE.pdf',
  },
  {
    id: 'INV-003',
    date: '01/08-2025',
    amount: 'DKK 2,300.00',
    status: 'Unpaid',
    fileUrl: 'Invoice_10700_TEST_EXAMPLE.pdf',
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: 'act-001',
    description: 'Added new staff member',
    timestamp: '10:15 AM',
    clubId: 'club-001',
    userId: 'user-006',
    type: 'user',
  },
  {
    id: 'act-002',
    description: 'New agreement signed',
    timestamp: 'Yesterday',
    clubId: 'club-001',
    agreementId: 'AGR-001244',
    type: 'agreement',
  },
  {
    id: 'act-003',
    description: 'Order #2458 processing',
    timestamp: 'Yesterday',
    clubId: 'club-001',
    orderId: 'ORD-2458',
    type: 'order',
  },
  {
    id: 'act-004',
    description: 'New club admin added',
    timestamp: 'Apr 15',
    clubId: 'club-001',
    userId: 'user-004',
    type: 'user',
  },
  {
    id: 'act-005',
    description: 'Agreement template "2025 Team Kit" created',
    timestamp: 'Apr 14',
    type: 'agreement',
  },
  {
    id: 'act-006',
    description: "Player kit details completed for Women's Team",
    timestamp: '2 hours ago',
    clubId: 'club-001',
    teamId: 'team-003',
    agreementId: 'AGR-001243',
    type: 'team',
  },
  {
    id: 'act-007',
    description: 'Brøndby IF order (#ORD-2457) shipped',
    timestamp: 'Yesterday',
    clubId: 'club-001',
    orderId: 'ORD-2457',
    type: 'order',
  },
];

// Mock Tasks for Club Staff
export const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Complete Player Kit Details',
    teamId: 'team-001',
    agreementId: 'AGR-001245',
    dueDate: 'Apr 25, 2025',
    status: 'in-progress',
    completionPercentage: 50,
    priority: 'high',
    assignedTo: 'user-006',
  },
  {
    id: 'task-002',
    title: 'Verify Youth Team Roster',
    teamId: 'team-002',
    agreementId: 'AGR-001246',
    dueDate: 'Apr 22, 2025',
    status: 'pending',
    completionPercentage: 0,
    priority: 'medium',
    assignedTo: 'user-006',
  },
  {
    id: 'task-003',
    title: 'Review Order Status',
    teamId: 'team-003',
    agreementId: 'AGR-001243',
    dueDate: 'Apr 18, 2025',
    status: 'complete',
    completionPercentage: 100,
    priority: 'high',
    assignedTo: 'user-006',
  },
  {
    id: 'task-004',
    title: 'Approve Training Kit Designs',
    teamId: 'team-001',
    agreementId: 'AGR-001245',
    dueDate: 'May 1, 2025',
    status: 'pending',
    completionPercentage: 0,
    priority: 'low',
    assignedTo: 'user-006',
  },
];

export const mockTeamViewModels: TeamViewModel[] = [
  {
    id: 'team-001',
    name: 'Lykkeliga Ribe Blues',
    playerCount: 10,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-002',
    name: 'U6 og U7 Drenge / Piger',
    playerCount: 12,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-003',
    name: 'U8 og U9 Drenge',
    playerCount: 14,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-004',
    name: 'U8 og U9 Piger',
    playerCount: 18,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-005',
    name: 'U11 Piger',
    playerCount: 15,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-006',
    name: 'U11 Drenge',
    playerCount: 14,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-007',
    name: 'U13 Piger',
    playerCount: 18,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-008',
    name: 'U13 Drenge',
    playerCount: 14,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-009',
    name: 'U15 Piger',
    playerCount: 18,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-010',
    name: 'U15 Drenge',
    playerCount: 14,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-011',
    name: 'Serie 3 Damer',
    playerCount: 18,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-012',
    name: 'U17 Drenge',
    playerCount: 14,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-013',
    name: 'U17 Piger',
    playerCount: 18,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-014',
    name: 'U19 Drenge',
    playerCount: 14,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-015',
    name: 'U19 Piger',
    playerCount: 18,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-016',
    name: '3. Division Herrer',
    playerCount: 14,
    kitRequestCount: 0,
    pendingCount: 0,
  },
  {
    id: 'team-017',
    name: 'Herresenior (Serie 1)',
    playerCount: 18,
    kitRequestCount: 0,
    pendingCount: 0,
  },
];

export const winnerCodes: Record<string, WinnerCodeEntry> = {
  2222333344445555: { used: false },
  1111222233334444: { used: false },
  1234123412341234: { used: true },
};

export const mockKitRequests: KitRequestViewModel[] = [
  {
    id: 'AGR-001245',
    name: 'U17 Drenge Spillertrøjer 2025/26',
    teamName: 'U17 Drenge',
    status: AgreementStatus.Active,
    dueDate: '15. Maj, 2025',
    progress: 50,
    playerCount: 14,
    completedCount: 1,
    isRequired: true,
  },
  {
    id: 'AGR-001246',
    name: 'U19 Piger Spillertrøjer 2025/26',
    teamName: 'U19 Piger',
    status: AgreementStatus.Active,
    dueDate: '20. April, 2025',
    progress: 100,
    playerCount: 2,
    completedCount: 2,
    isRequired: true,
  },
  {
    id: 'AGR-001247',
    name: 'Club Staff Apparel',
    teamName: 'Staff',
    status: AgreementStatus.Active,
    dueDate: 'Apr 30, 2025',
    progress: 75,
    playerCount: 4,
    completedCount: 3,
    isRequired: false,
  },
];

// Mock order view models
export const mockOrderViewModels: OrderViewModel[] = [
  {
    id: 'ORD-2458',
    agreementId: 'AGR-001243',
    clubId: 'club-001',
    teamId: 'team-015',
    teamName: 'U19 Piger',
    kitName: 'U19 Piger Spillertrøjer 2025/26',
    createdAt: '4. Maj, 2025',
    updatedAt: '6. Maj, 2025',
    status: OrderStatus.Processing,
    items: 54,
    estimatedDelivery: '20. Maj, 2025',
    playerCount: 18,
    progress: 40,
  },
  {
    id: 'ORD-2456',
    agreementId: 'AGR-001242',
    clubId: 'club-001',
    teamId: 'team-001',
    teamName: 'Lykkeliga Ribe Blues',
    kitName: 'Lykkeliga Ribe Blues Spillertrøjer 2024/25',
    createdAt: 'Mar 25, 2024',
    updatedAt: 'Apr 10, 2024',
    status: OrderStatus.Delivered,
    completedBy: 'user-003',
    items: 42,
    playerCount: 14,
    progress: 100,
  },
  // {
  //   id: 'ORD-2455',
  //   agreementId: 'AGR-001241',
  //   clubId: 'club-001',
  //   teamId: 'team-004',
  //   teamName: 'U16 Team',
  //   kitName: 'U16 Training Gear',
  //   createdAt: 'Mar 20, 2025',
  //   updatedAt: 'Mar 22, 2025',
  //   status: OrderStatus.Canceled,
  //   items: 30,
  //   playerCount: 10,
  //   progress: 0,
  // },
  // {
  //   id: 'ORD-2454',
  //   agreementId: 'AGR-001240',
  //   clubId: 'club-001',
  //   teamId: 'team-001',
  //   teamName: 'First Team',
  //   kitName: 'First Team Training Gear',
  //   createdAt: 'Mar 15, 2025',
  //   updatedAt: 'Mar 15, 2025',
  //   status: OrderStatus.Pending,
  //   items: 48,
  //   playerCount: 16,
  //   progress: 10,
  // },
];

export const mockKitDetailRoster: {
  id: string;
  name: string;
  position: string;
  isActive: boolean;
  image?: string;
}[] = [
  {
    id: 'player-001',
    name: 'Lasse Vigsø Lynddahl',
    position: 'Markspiller',
    isActive: true,
    image: '/faces/lasse-vigsø-lynddahl.jpg',
  },
  {
    id: 'player-002',
    name: 'Niklas Kraft',
    position: 'Målmand',
    isActive: true,
    image: '/faces/niklas-kraft.png',
  },
  {
    id: 'player-003',
    name: 'Elma Madsen',
    position: 'Markspiller',
    isActive: true,
    image: '/faces/elma-madsen.jpg',
  },
];

// Mock Product Data
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Hjemmebane Spillertrøje',
    price: 180,
    images: ['rhk-spillertrøje-front.jpg', 'rhk-spillertrøje-bagside.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    customizable: true,
    description:
      'Gør dig klar til kamp med vores officielle hjemmebane spillertrøje – skabt til både præstation og passion. Trøjen er lavet i et let og åndbart materiale, der sikrer optimal komfort, uanset om du er på banen eller på tilskuerpladserne. Det klassiske design kombinerer holdets farver med moderne detaljer, og der er mulighed for personliggørelse med navn og nummer. Perfekt pasform og høj kvalitet gør denne trøje til et must-have for enhver ægte fan. Vis din støtte med stil – både til træning, kamp og hverdag.',
  },
  {
    id: 2,
    name: 'Hjemmebane Spillershorts',
    price: 90,
    images: ['rhk-spillershorts-front.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    customizable: true,
    description:
      'Vores hjemmebane spillershorts er designet til maksimal bevægelsesfrihed og komfort. Fremstillet i letvægtsmateriale, der sikrer god åndbarhed og hurtig tørretid. Shortsene matcher trøjen perfekt og kan tilpasses med navn og nummer, så du kan spille med stil og personlighed.',
  },
  {
    id: 3,
    name: 'Hummel Evolution AR Handball Energizer Gr 1',
    price: 100,
    images: ['handball-1.jpg'],
    customizable: false,
    description:
      'Den officielle Hummel Evolution AR håndbold Energizer i størrelse 1 – perfekt til træning og kamp. Bolden er lavet af slidstærkt materiale med godt greb, der sikrer præcision og kontrol i spillet. En pålidelig bold til håndboldspillere på alle niveauer.',
  },
  {
    id: 4,
    name: 'Hummel Evolution AR Handball Energizer Gr 2',
    price: 100,
    images: ['handball-2.jpg'],
    customizable: false,
    description:
      'Den officielle Hummel Evolution AR håndbold Energizer i størrelse 2 – designet til optimal ydeevne og holdbarhed. Med et greb, der sikrer sikker boldkontrol, er denne bold ideel til spillere, der ønsker kvalitet i hver aflevering og skud.',
  },
  {
    id: 5,
    name: 'Supreme Sportstape 8-pack (3,8 cm. x 13,7 m.)',
    price: 125,
    images: ['sportstape-1.webp'],
    customizable: false,
    description:
      'Supreme sportstape i 8-pak, ideel til støtte og beskyttelse under træning og kamp. Tapen har stærk vedhæftning og fleksibilitet, som giver sikker støtte uden at hæmme bevægelsen. Et must-have til seriøse atleter.',
  },
  {
    id: 6,
    name: 'Strappal sportstape 24-pack (4 cm. x 10 m.)',
    price: 200,
    images: ['sportstape-2.webp'],
    customizable: false,
    description:
      'Strappal sportstape i 24-pak med 4 cm bredde – perfekt til professionel brug. Tapen er åndbar, slidstærk og sikrer god støtte til led og muskler. Velegnet til forebyggelse og behandling af skader.',
  },
  {
    id: 7,
    name: 'Strappal sportstape 36-pack (2,5 cm. x 10 m.)',
    price: 250,
    images: ['sportstape-3.webp'],
    customizable: false,
    description:
      'Strappal sportstape i 36-pak med smal bredde på 2,5 cm, ideel til præcis taping og støtte. Tapen er stærk, fleksibel og åndbar, hvilket gør den perfekt til brug under alle typer sport.',
  },
  {
    id: 8,
    name: 'SELECT Teamgear Harpiks 100 ML',
    price: 50,
    images: ['resin-2.webp'],
    customizable: false,
    description:
      'SELECT Teamgear harpiks i 100 ml – forbedrer grebet på bolden og sikrer optimal kontrol under spillet. Let at påføre og klæbrig nok til at holde bolden sikkert i hånden, uden at den bliver klistret.',
  },
  {
    id: 9,
    name: 'SELECT Teamgear Harpiks 500 ML',
    price: 200,
    images: ['resin-1.webp'],
    customizable: false,
    description:
      'SELECT Teamgear harpiks i stor 500 ml flaske – perfekt til holdet eller den ivrige spiller, der har brug for langvarigt greb. Effektiv, nem at bruge og med en behagelig konsistens, der ikke klumper.',
  },
];

// Helper functions

// Helper function to get club by ID
export function getClubById(id: string): Club | undefined {
  return mockClubs.find((club) => club.id === id);
}

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

// Helper function to get template by ID
export function getTemplateById(id: string): AgreementTemplate | undefined {
  return mockAgreementTemplates.find((template) => template.id === id);
}

// Helper function to get agreement by ID
export function getAgreementById(id: string): Agreement | undefined {
  return mockAgreements.find((agreement) => agreement.id === id);
}

// Helper function to get team by ID
export function getTeamById(id: string): Team | undefined {
  return mockTeams.find((team) => team.id === id);
}

// Helper function to get player by ID
export function getPlayerById(id: string): Player | undefined {
  return mockPlayers.find((player) => player.id === id);
}

// Helper function to get order by ID
export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((order) => order.id === id);
}

// Helper function to get club finance
export function getClubFinance(clubId: string): User | undefined {
  return mockUsers.find((user) => user.clubId === clubId && user.role === UserRole.ClubFinance);
}

// Helper function to get club admin
export function getClubAdmin(clubId: string): User | undefined {
  return mockUsers.find((user) => user.clubId === clubId && user.role === UserRole.ClubAdmin);
}

// Helper function to get club staff
export function getClubStaff(clubId: string): User[] {
  return mockUsers.filter((user) => user.clubId === clubId && user.role === UserRole.ClubStaff);
}

// Helper function to get club teams
export function getClubTeams(clubId: string): Team[] {
  return mockTeams.filter((team) => team.clubId === clubId);
}

// Helper function to get team players
export function getTeamPlayers(teamId: string): Player[] {
  return mockPlayers.filter((player) => player.teamId === teamId);
}

// Helper function to get club agreements
export function getClubAgreements(clubId: string): Agreement[] {
  return mockAgreements.filter((agreement) => agreement.clubId === clubId);
}

// Helper function to get team agreements
export function getTeamAgreements(teamId: string): Agreement[] {
  return mockAgreements.filter((agreement) => agreement.teamId === teamId);
}

// Helper function to get player mappings for an agreement
export function getAgreementPlayerMappings(agreementId: string): PlayerMapping[] {
  return mockPlayerMappings.filter((mapping) => mapping.agreementId === agreementId);
}

// Helper function to get player mapping
export function getPlayerMapping(agreementId: string, playerId: string): PlayerMapping | undefined {
  return mockPlayerMappings.find(
    (mapping) => mapping.agreementId === agreementId && mapping.playerId === playerId,
  );
}

// Helper function to get club orders
export function getClubOrders(clubId: string): Order[] {
  return mockOrders.filter((order) => order.clubId === clubId);
}

// Helper function to get team orders
export function getTeamOrders(teamId: string): Order[] {
  return mockOrders.filter((order) => order.teamId === teamId);
}

// Helper function to get agreement order
export function getAgreementOrder(agreementId: string): Order | undefined {
  return mockOrders.find((order) => order.agreementId === agreementId);
}

// Helper function to get club activities
export function getClubActivities(clubId: string): Activity[] {
  return mockActivities.filter((activity) => activity.clubId === clubId);
}

// Helper function to get user tasks
export function getUserTasks(userId: string): Task[] {
  return mockTasks.filter((task) => task.assignedTo === userId);
}

// Helper function to get agreement tasks
export function getAgreementTasks(agreementId: string): Task[] {
  return mockTasks.filter((task) => task.agreementId === agreementId);
}

// Helper function to calculate agreement completion percentage
export function calculateAgreementCompletion(agreementId: string): number {
  const mappings = getAgreementPlayerMappings(agreementId);
  if (mappings.length === 0) return 0;

  const completedMappings = mappings.filter((mapping) => mapping.isComplete).length;
  return Math.round((completedMappings / mappings.length) * 100);
}

// Get team view models for a club
export function getClubTeamViewModels(clubId: string): TeamViewModel[] {
  const teamIds = mockTeams.filter((team) => team.clubId === clubId).map((team) => team.id);

  return mockTeamViewModels.filter((team) => teamIds.includes(team.id));
}

// Get kit requests for a club
export function getClubKitRequests(clubId: string): KitRequestViewModel[] {
  return mockKitRequests.filter((request) => {
    const agreement = mockAgreements.find((a) => a.id === request.id);
    return agreement && agreement.clubId === clubId;
  });
}

// Get order view models for a club
export function getClubOrderViewModels(clubId: string): OrderViewModel[] {
  return mockOrderViewModels.filter((order) => order.clubId === clubId);
}

// Get order view model by id
export function getOrderViewModel(orderId: string): OrderViewModel | undefined {
  return mockOrderViewModels.find((order) => order.id === orderId);
}

// Get kit request by id
export function getKitRequest(requestId: string): KitRequestViewModel | undefined {
  return mockKitRequests.find((request) => request.id === requestId);
}

export function getPlayerKitDetailsViewModel(
  agreementId: string,
): PlayerKitDetailsViewModel | null {
  const agreement = mockAgreements.find((a) => a.id === agreementId);
  if (!agreement) return null;

  const template = mockAgreementTemplates.find((t) => t.id === agreement.templateId);
  if (!template) return null;

  const team = mockTeams.find((t) => t.id === agreement.teamId);

  return {
    id: agreement.id,
    name: agreement.name,
    clubId: agreement.clubId,
    teamId: agreement.teamId,
    teamName: team?.name || 'Team',
    status: agreement.status,
    validUntil: agreement.validUntil,
    dueDate: agreement.dueDate || 'Apr 25, 2025', // Default due date if not available
    fields: template.fields || [],
    playerMappings: getAgreementPlayerMappings(agreementId),
  };
}

// Helper function to get roster for a kit agreement
export function getAgreementRoster(agreementId: string): typeof mockKitDetailRoster {
  const agreement = mockAgreements.find((a) => a.id === agreementId);
  if (!agreement || !agreement.teamId) return [];

  // In a real app, we'd fetch the actual team roster
  // For mock data, we'll return our standard roster with proper team filtering
  return mockKitDetailRoster;
}
