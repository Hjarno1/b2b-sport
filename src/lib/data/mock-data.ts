// src/lib/data/mock-data.ts

// User Roles
export enum UserRole {
  B2BSportAdmin = 'B2B Sport Admin',
  ClubAdmin = 'Club Admin',
  ClubStaff = 'Club Staff',
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
  Goalkeeper = 'Goalkeeper',
  Defender = 'Defender',
  Midfielder = 'Midfielder',
  Forward = 'Forward',
  Utility = 'Utility',
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

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Casper Pedersen',
    email: 'casper@b2bsport.dk',
    role: UserRole.B2BSportAdmin,
    status: UserStatus.Active,
    avatar: '/faces/casper.jpg',
    lastLogin: 'April 16, 2025, 10:30 AM',
  },
  {
    id: 'user-002',
    name: 'Brian Frisch',
    email: 'bifr@brondby.com',
    role: UserRole.ClubAdmin,
    clubId: 'club-002',
    status: UserStatus.Active,
    avatar: '/faces/brian.jpg',
    lastLogin: 'April 16, 2025, 9:15 AM',
  },
  {
    id: 'user-003',
    name: 'Ole Andersen',
    email: 'ole@ribehk.com',
    role: UserRole.ClubAdmin,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/faces/uifaces-01.jpg',
    lastLogin: 'April 15, 2025, 3:45 PM',
  },
  {
    id: 'user-004',
    name: 'Grethe Jensen',
    email: 'grje@efb.dk',
    role: UserRole.ClubAdmin,
    clubId: 'club-003',
    status: UserStatus.Inactive,
    avatar: '/faces/uifaces-02.jpg',
    lastLogin: 'April 10, 2025, 11:20 AM',
  },
  {
    id: 'user-005',
    name: 'Bente Larsen',
    email: 'bela@b93.dk',
    role: UserRole.ClubAdmin,
    clubId: 'club-004',
    status: UserStatus.Pending,
    avatar: '/faces/uifaces-03.jpg',
  },
  {
    id: 'user-006',
    name: 'Bjarne Pedersen',
    email: 'bjpe@ribehk.dk',
    role: UserRole.ClubStaff,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/faces/uifaces-04.jpg',
    lastLogin: 'April 16, 2025, 8:45 AM',
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
  {
    id: 'club-002',
    name: 'Brøndby IF',
    adminId: 'user-002',
    createdAt: 'Feb 20, 2025',
    staffCount: 5,
    activeAgreements: 1,
    status: ClubStatus.Active,
    abbreviation: 'BIF',
    color: '#9C27B0',
    logo: '/clubs/brondby.png',
  },
  {
    id: 'club-003',
    name: 'Esbjerg fB',
    adminId: 'user-004',
    createdAt: 'Mar 5, 2025',
    staffCount: 3,
    activeAgreements: 0,
    status: ClubStatus.Inactive,
    abbreviation: 'EFB',
    color: '#FF5722',
    logo: '/clubs/efb.png',
  },
  {
    id: 'club-004',
    name: 'B93',
    createdAt: 'Apr 10, 2025',
    staffCount: 0,
    activeAgreements: 0,
    status: ClubStatus.Setup,
    abbreviation: 'B93',
    color: '#607D8B',
    logo: '/clubs/b93.png',
  },
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: 'team-001',
    name: 'First Team',
    clubId: 'club-001',
    playerCount: 16,
    type: 'First Team',
    createdAt: 'Jan 15, 2025',
  },
  {
    id: 'team-002',
    name: 'Youth Team',
    clubId: 'club-001',
    playerCount: 12,
    type: 'Youth Team',
    createdAt: 'Jan 15, 2025',
  },
  {
    id: 'team-003',
    name: "Women's Team",
    clubId: 'club-001',
    playerCount: 14,
    type: "Women's Team",
    createdAt: 'Feb 01, 2025',
  },
  {
    id: 'team-004',
    name: 'First Team',
    clubId: 'club-002',
    playerCount: 18,
    type: 'First Team',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'team-005',
    name: 'U18 Team',
    clubId: 'club-002',
    playerCount: 15,
    type: 'Youth Team',
    createdAt: 'Feb 20, 2025',
  },
];

// Mock Players
export const mockPlayers: Player[] = [
  {
    id: 'player-001',
    name: 'Alex Johnson',
    dateOfBirth: '1995-05-12',
    email: 'alex.johnson@email.com',
    phone: '+45 12 34 56 78',
    position: PlayerPosition.Forward,
    joinedDate: '2020-08-15',
    clubId: 'club-001',
    teamId: 'team-001',
    image: '/faces/uifaces-01.jpg',
    isActive: true,
  },
  {
    id: 'player-002',
    name: 'Sam Lee',
    dateOfBirth: '1997-11-23',
    email: 'sam.lee@email.com',
    phone: '+45 23 45 67 89',
    position: PlayerPosition.Midfielder,
    joinedDate: '2021-01-10',
    clubId: 'club-001',
    teamId: 'team-001',
    image: '/faces/uifaces-02.jpg',
    isActive: true,
  },
  {
    id: 'player-003',
    name: 'Taylor Martinez',
    dateOfBirth: '1998-03-05',
    email: 'taylor.m@email.com',
    phone: '+45 34 56 78 90',
    position: PlayerPosition.Defender,
    joinedDate: '2019-06-20',
    clubId: 'club-001',
    teamId: 'team-001',
    image: '/faces/uifaces-03.jpg',
    isActive: true,
  },
  {
    id: 'player-004',
    name: 'Jordan Smith',
    dateOfBirth: '1994-09-17',
    email: 'jordan.smith@email.com',
    phone: '+45 45 67 89 01',
    position: PlayerPosition.Goalkeeper,
    joinedDate: '2018-07-05',
    clubId: 'club-001',
    teamId: 'team-001',
    image: '/faces/uifaces-04.jpg',
    isActive: true,
  },
  {
    id: 'player-005',
    name: 'Morgan Williams',
    dateOfBirth: '1996-12-28',
    email: 'morgan.w@email.com',
    phone: '+45 56 78 90 12',
    position: PlayerPosition.Forward,
    joinedDate: '2022-02-15',
    clubId: 'club-001',
    teamId: 'team-001',
    isActive: false,
    notes: 'On loan to another club until 2023',
  },
  // Youth team players
  {
    id: 'player-006',
    name: 'Mikkel Hansen',
    dateOfBirth: '2006-04-18',
    position: PlayerPosition.Forward,
    joinedDate: '2022-08-01',
    clubId: 'club-001',
    teamId: 'team-002',
    isActive: true,
  },
  {
    id: 'player-007',
    name: 'Lukas Nielsen',
    dateOfBirth: '2007-03-22',
    position: PlayerPosition.Midfielder,
    joinedDate: '2022-08-01',
    clubId: 'club-001',
    teamId: 'team-002',
    isActive: true,
  },
  // Women's team players
  {
    id: 'player-008',
    name: 'Emma Pedersen',
    dateOfBirth: '1997-06-14',
    position: PlayerPosition.Defender,
    joinedDate: '2022-02-15',
    clubId: 'club-001',
    teamId: 'team-003',
    isActive: true,
  },
  {
    id: 'player-009',
    name: 'Sophia Larsen',
    dateOfBirth: '1999-09-08',
    position: PlayerPosition.Goalkeeper,
    joinedDate: '2022-02-15',
    clubId: 'club-001',
    teamId: 'team-003',
    isActive: true,
  },
  // Brøndby players
  {
    id: 'player-010',
    name: 'Anders Jensen',
    dateOfBirth: '1996-11-05',
    position: PlayerPosition.Forward,
    joinedDate: '2021-07-01',
    clubId: 'club-002',
    teamId: 'team-004',
    isActive: true,
  },
  {
    id: 'player-011',
    name: 'Frederik Møller',
    dateOfBirth: '1998-02-18',
    position: PlayerPosition.Midfielder,
    joinedDate: '2021-07-01',
    clubId: 'club-002',
    teamId: 'team-004',
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
    name: 'First Team 2025 Season Kit',
    clubId: 'club-001',
    teamId: 'team-001',
    templateId: 'template-001',
    status: AgreementStatus.Active,
    createdAt: 'Apr 15, 2025',
    updatedAt: 'Apr 16, 2025',
    validUntil: 'May 15, 2025',
    priority: 'Normal',
    dueDate: 'Apr 25, 2025',
    completionPercentage: 50,
    approvedBy: 'user-003',
    approvedDate: 'Apr 16, 2025',
  },
  {
    id: 'AGR-001246',
    name: 'Youth Team Training Kit',
    clubId: 'club-001',
    teamId: 'team-002',
    templateId: 'template-002',
    status: AgreementStatus.Pending,
    createdAt: 'Apr 14, 2025',
    updatedAt: 'Apr 14, 2025',
    validUntil: 'May 15, 2025',
    priority: 'Low',
    dueDate: 'May 05, 2025',
    completionPercentage: 0,
  },
  {
    id: 'AGR-001244',
    name: 'Brøndby IF First Team Kit',
    clubId: 'club-002',
    teamId: 'team-004',
    templateId: 'template-001',
    status: AgreementStatus.Active,
    createdAt: 'Apr 10, 2025',
    updatedAt: 'Apr 12, 2025',
    validUntil: 'Jun 10, 2025',
    priority: 'High',
    dueDate: 'Apr 20, 2025',
    completionPercentage: 75,
    approvedBy: 'user-002',
    approvedDate: 'Apr 12, 2025',
  },
  {
    id: 'AGR-001243',
    name: "Women's Team Goalkeeper Kit",
    clubId: 'club-001',
    teamId: 'team-003',
    templateId: 'template-003',
    status: AgreementStatus.Completed,
    createdAt: 'Apr 5, 2025',
    updatedAt: 'Apr 15, 2025',
    validUntil: 'May 5, 2025',
    priority: 'High',
    dueDate: 'Apr 15, 2025',
    completionPercentage: 100,
    approvedBy: 'user-003',
    approvedDate: 'Apr 08, 2025',
  },
  {
    id: 'AGR-001242',
    name: 'Brøndby IF Youth Team Kit',
    clubId: 'club-002',
    teamId: 'team-005',
    templateId: 'template-004',
    status: AgreementStatus.Draft,
    createdAt: 'Mar 20, 2025',
    updatedAt: 'Mar 20, 2025',
    validUntil: 'Apr 20, 2025',
    priority: 'Normal',
    dueDate: 'Apr 30, 2025',
    completionPercentage: 0,
  },
  {
    id: 'AGR-001241',
    name: 'Esbjerg FB Youth Program',
    clubId: 'club-003',
    teamId: '',
    templateId: 'template-004',
    status: AgreementStatus.Canceled,
    createdAt: 'Mar 15, 2025',
    updatedAt: 'Mar 22, 2025',
    validUntil: 'Apr 15, 2025',
    priority: 'Low',
    dueDate: 'Apr 10, 2025',
    completionPercentage: 0,
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
      'jersey-name': 'JOHNSON',
      'jersey-size': 'M',
      'shorts-size': 'M',
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
      'jersey-number': '8',
      'jersey-name': 'LEE',
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
    agreementId: 'AGR-001243',
    playerId: 'player-009',
    values: {
      'jersey-number': '1',
      'jersey-name': 'LARSEN',
      'jersey-size': 'M',
      'shorts-size': 'M',
      'socks-size': 'M (7-9)',
      'glove-size': '8',
      'additional-gear': 'Goalkeeper Gloves',
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
  },
  {
    id: 'ORD-2457',
    agreementId: 'AGR-001244',
    clubId: 'club-002',
    teamId: 'team-004',
    createdAt: 'Apr 14, 2025',
    updatedAt: 'Apr 15, 2025',
    status: OrderStatus.Shipped,
    items: 36,
    estimatedDelivery: 'Apr 20, 2025',
    trackingNumber: 'TRK123456789',
    playerCount: 12,
    progress: 75,
  },
  {
    id: 'ORD-2456',
    agreementId: 'AGR-001242',
    clubId: 'club-002',
    teamId: 'team-005',
    createdAt: 'Mar 25, 2025',
    updatedAt: 'Apr 10, 2025',
    status: OrderStatus.Delivered,
    items: 42,
    completedBy: 'user-003',
    playerCount: 14,
    progress: 100,
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
    clubId: 'club-002',
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
    clubId: 'club-003',
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
    clubId: 'club-002',
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
    name: 'First Team',
    playerCount: 16,
    kitRequestCount: 1,
    pendingCount: 1,
  },
  {
    id: 'team-002',
    name: 'Youth Team',
    playerCount: 12,
    kitRequestCount: 1,
    pendingCount: 1,
  },
  {
    id: 'team-003',
    name: "Women's Team",
    playerCount: 14,
    kitRequestCount: 1,
    pendingCount: 0,
  },
  {
    id: 'team-004',
    name: 'Staff',
    playerCount: 4,
    kitRequestCount: 1,
    pendingCount: 0,
  },
];

export const mockKitRequests: KitRequestViewModel[] = [
  {
    id: 'AGR-001244',
    name: 'First Team 2025 Season Kit',
    teamName: 'First Team',
    status: AgreementStatus.InProgress,
    dueDate: 'Apr 25, 2025',
    progress: 50,
    playerCount: 16,
    completedCount: 8,
    isRequired: true,
  },
  {
    id: 'AGR-001245',
    name: 'Youth Team Training Kit',
    teamName: 'Youth Team',
    status: AgreementStatus.Pending,
    dueDate: 'May 05, 2025',
    progress: 0,
    playerCount: 12,
    completedCount: 0,
    isRequired: true,
  },
  {
    id: 'AGR-001246',
    name: "Women's Team Goalkeeper Kit",
    teamName: "Women's Team",
    status: AgreementStatus.Active,
    dueDate: 'Apr 20, 2025',
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
    teamId: 'team-001',
    teamName: 'First Team',
    kitName: 'First Team Match Kits',
    createdAt: 'Apr 12, 2025',
    updatedAt: 'Apr 16, 2025',
    status: OrderStatus.Processing,
    items: 48,
    estimatedDelivery: 'Apr 26, 2025',
    playerCount: 16,
    progress: 40,
  },
  {
    id: 'ORD-2457',
    agreementId: 'AGR-001244',
    clubId: 'club-002',
    teamId: 'team-002',
    teamName: 'Youth Team',
    kitName: 'Youth Team Training Gear',
    createdAt: 'Apr 11, 2025',
    updatedAt: 'Apr 15, 2025',
    status: OrderStatus.Shipped,
    items: 36,
    estimatedDelivery: 'Apr 20, 2025',
    trackingNumber: 'TRK123456789',
    playerCount: 12,
    progress: 75,
  },
  {
    id: 'ORD-2456',
    agreementId: 'AGR-001242',
    clubId: 'club-002',
    teamId: 'team-003',
    teamName: "Women's Team",
    kitName: "Women's Team Match Kits",
    createdAt: 'Mar 25, 2025',
    updatedAt: 'Apr 10, 2025',
    status: OrderStatus.Delivered,
    completedBy: 'user-003',
    items: 42,
    playerCount: 14,
    progress: 100,
  },
  {
    id: 'ORD-2455',
    agreementId: 'AGR-001241',
    clubId: 'club-001',
    teamId: 'team-004',
    teamName: 'U16 Team',
    kitName: 'U16 Training Gear',
    createdAt: 'Mar 20, 2025',
    updatedAt: 'Mar 22, 2025',
    status: OrderStatus.Canceled,
    items: 30,
    playerCount: 10,
    progress: 0,
  },
  {
    id: 'ORD-2454',
    agreementId: 'AGR-001240',
    clubId: 'club-001',
    teamId: 'team-001',
    teamName: 'First Team',
    kitName: 'First Team Training Gear',
    createdAt: 'Mar 15, 2025',
    updatedAt: 'Mar 15, 2025',
    status: OrderStatus.Pending,
    items: 48,
    playerCount: 16,
    progress: 10,
  },
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
    name: 'Alex Johnson',
    position: 'Forward',
    isActive: true,
    image: '/faces/uifaces-01.jpg',
  },
  {
    id: 'player-002',
    name: 'Sam Lee',
    position: 'Midfielder',
    isActive: true,
    image: '/faces/uifaces-02.jpg',
  },
  {
    id: 'player-003',
    name: 'Taylor Martinez',
    position: 'Defender',
    isActive: true,
    image: '/faces/uifaces-03.jpg',
  },
  {
    id: 'player-004',
    name: 'Jordan Smith',
    position: 'Goalkeeper',
    isActive: true,
    image: '/faces/uifaces-04.jpg',
  },
  {
    id: 'player-005',
    name: 'Morgan Williams',
    position: 'Forward',
    isActive: false,
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
