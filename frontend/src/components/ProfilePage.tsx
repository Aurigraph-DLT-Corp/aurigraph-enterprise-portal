/**
 * Developer Profile Page
 *
 * Account management, API keys, SDK access, and project tracking
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Tabs,
  Table,
  Space,
  Tag,
  Modal,
  Message,
  Tooltip,
  Badge,
  Divider,
  Avatar,
  Statistic,
  Empty,
  Select,
  Checkbox,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  KeyOutlined,
  FileTextOutlined,
  DeleteOutlined,
  CopyOutlined,
  PlusOutlined,
  DownloadOutlined,
  LogoutOutlined,
  MailOutlined,
  TeamOutlined,
  ApiOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import './ProfilePage.css';

const { Title, Paragraph, Text } = Typography;

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
  isActive: boolean;
}

interface Project {
  id: string;
  name: string;
  language: string;
  status: 'active' | 'completed' | 'paused';
  created: string;
  usedEndpoints: number;
  apiCalls: number;
}

interface AccessLog {
  id: string;
  timestamp: string;
  action: string;
  resource: string;
  status: string;
  ipAddress: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('overview');
  const [modalVisible, setModalVisible] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  // Sample data
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'key_1',
      name: 'Production - Python App',
      key: 'sk_live_1234567890abcdefgh...',
      created: '2024-12-20',
      lastUsed: '2024-12-29 14:32',
      isActive: true,
    },
    {
      id: 'key_2',
      name: 'Development - Local Testing',
      key: 'sk_dev_0987654321zyxwvut...',
      created: '2024-12-15',
      lastUsed: '2024-12-29 09:15',
      isActive: true,
    },
  ]);

  const projects: Project[] = [
    {
      id: 'proj_1',
      name: 'Supply Chain Tracking',
      language: 'Python',
      status: 'active',
      created: '2024-12-01',
      usedEndpoints: 8,
      apiCalls: 15420,
    },
    {
      id: 'proj_2',
      name: 'Real Estate Tokenization',
      language: 'Go',
      status: 'active',
      created: '2024-12-10',
      usedEndpoints: 12,
      apiCalls: 8932,
    },
    {
      id: 'proj_3',
      name: 'Prototype - Asset Registry',
      language: 'TypeScript',
      status: 'paused',
      created: '2024-11-20',
      usedEndpoints: 5,
      apiCalls: 2341,
    },
  ];

  const accessLogs: AccessLog[] = [
    {
      id: '1',
      timestamp: '2024-12-29 14:32:15',
      action: 'API Request',
      resource: '/transactions/create',
      status: 'Success',
      ipAddress: '192.168.1.100',
    },
    {
      id: '2',
      timestamp: '2024-12-29 14:15:42',
      action: 'API Request',
      resource: '/assets/list',
      status: 'Success',
      ipAddress: '192.168.1.100',
    },
    {
      id: '3',
      timestamp: '2024-12-29 09:15:30',
      action: 'Key Created',
      resource: 'API Key: Development - Local Testing',
      status: 'Success',
      ipAddress: '192.168.1.50',
    },
    {
      id: '4',
      timestamp: '2024-12-28 16:45:12',
      action: 'Profile Updated',
      resource: 'Account Settings',
      status: 'Success',
      ipAddress: '192.168.1.100',
    },
  ];

  const handleCreateKey = () => {
    if (newKeyName.trim()) {
      const newKey: APIKey = {
        id: `key_${Date.now()}`,
        name: newKeyName,
        key: `sk_live_${Math.random().toString(36).substring(2, 50)}...`,
        created: new Date().toISOString().split('T')[0],
        isActive: true,
      };
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');
      setModalVisible(false);
      Message.success('API Key created successfully');
    }
  };

  const handleRevokeKey = (keyId: string) => {
    Modal.confirm({
      title: 'Revoke API Key?',
      content: 'This action cannot be undone. All applications using this key will stop working.',
      okText: 'Revoke',
      okType: 'danger',
      onOk() {
        setApiKeys(apiKeys.filter((k) => k.id !== keyId));
        Message.success('API Key revoked');
      },
    });
  };

  const apiKeysColumns = [
    {
      title: 'Key Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: APIKey) => (
        <Space>
          <KeyOutlined />
          <Text strong>{text}</Text>
          {record.isActive && <Badge status="success" text="Active" />}
        </Space>
      ),
    },
    {
      title: 'Key Value',
      dataIndex: 'key',
      key: 'key',
      render: (text: string) => (
        <Tooltip title="Click to copy">
          <div
            style={{ cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px' }}
            onClick={() => {
              navigator.clipboard.writeText(text);
              Message.success('Copied to clipboard');
            }}
          >
            {text} <CopyOutlined />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (text: string | undefined) => text || 'Never',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: APIKey) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRevokeKey(record.id)}
        >
          Revoke
        </Button>
      ),
    },
  ];

  const projectsColumns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <Space>
          <FileTextOutlined />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Created: {record.created}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (lang: string) => {
        const colorMap: { [key: string]: string } = {
          Python: 'cyan',
          Go: 'magenta',
          TypeScript: 'blue',
        };
        return <Tag color={colorMap[lang]}>{lang}</Tag>;
      },
    },
    {
      title: 'API Calls',
      dataIndex: 'apiCalls',
      key: 'apiCalls',
      render: (count: number) => <Text>{count.toLocaleString()}</Text>,
    },
    {
      title: 'Endpoints',
      dataIndex: 'usedEndpoints',
      key: 'usedEndpoints',
      render: (count: number) => <Text>{count} / 50</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: { [key: string]: any } = {
          active: <Badge status="success" text="Active" />,
          completed: <Badge status="default" text="Completed" />,
          paused: <Badge status="warning" text="Paused" />,
        };
        return statusMap[status];
      },
    },
  ];

  const accessLogsColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const iconMap: { [key: string]: any } = {
          'API Request': <ApiOutlined style={{ color: '#1890ff' }} />,
          'Key Created': <PlusOutlined style={{ color: '#52c41a' }} />,
          'Profile Updated': <SettingOutlined style={{ color: '#faad14' }} />,
        };
        return (
          <Space>
            {iconMap[action]}
            <Text>{action}</Text>
          </Space>
        );
      },
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      render: (resource: string) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {resource}
        </Text>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
  ];

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              John Developer
            </Title>
            <Text type="secondary">john@example.com</Text>
            <div style={{ marginTop: '8px' }}>
              <Tag color="green">Developer Account</Tag>
              <Tag color="blue">Verified</Tag>
            </div>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Button danger icon={<LogoutOutlined />}>
              Sign Out
            </Button>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Projects"
              value={2}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="API Keys"
              value={apiKeys.length}
              prefix={<KeyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total API Calls"
              value={26693}
              prefix={<ApiOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Account Age"
              value={43}
              suffix="days"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: (
              <span>
                <UserOutlined /> Overview
              </span>
            ),
            children: (
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card title="Account Information">
                    <Form layout="vertical" form={form}>
                      <Form.Item label="Full Name">
                        <Input value="John Developer" disabled />
                      </Form.Item>
                      <Form.Item label="Email Address">
                        <Input value="john@example.com" disabled />
                      </Form.Item>
                      <Form.Item label="Company">
                        <Input value="Acme Inc." disabled />
                      </Form.Item>
                      <Form.Item label="Role">
                        <Input value="Senior Software Engineer" disabled />
                      </Form.Item>
                      <Button type="primary">Edit Profile</Button>
                    </Form>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="SDK Access" icon={<ApiOutlined />}>
                    <Space direction="vertical">
                      <Alert
                        message="You have full access to all SDK documentation"
                        type="success"
                        icon={<CheckCircleOutlined />}
                        showIcon
                      />
                      <div>
                        <Text strong>Available SDKs:</Text>
                        <div style={{ marginTop: '8px' }}>
                          <Tag color="cyan">Python</Tag>
                          <Tag color="magenta">Go</Tag>
                          <Tag color="blue">TypeScript</Tag>
                          <Tag color="red">gRPC</Tag>
                        </div>
                      </div>
                      <div>
                        <Text strong>Documentation:</Text>
                        <div style={{ marginTop: '8px' }}>
                          <Button type="link" size="small" icon={<FileTextOutlined />}>
                            REST API Reference (1,117 lines)
                          </Button>
                          <br />
                          <Button type="link" size="small" icon={<FileTextOutlined />}>
                            gRPC Service Layer (1,432 lines)
                          </Button>
                        </div>
                      </div>
                      <Button icon={<DownloadOutlined />} block>
                        Download All Guides
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'keys',
            label: (
              <span>
                <KeyOutlined /> API Keys
              </span>
            ),
            children: (
              <Card title="API Keys & Tokens">
                <Alert
                  message="Keep your API keys secure. Never commit them to version control."
                  type="warning"
                  style={{ marginBottom: '16px' }}
                  showIcon
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                  style={{ marginBottom: '16px' }}
                >
                  Create New Key
                </Button>
                <Table
                  columns={apiKeysColumns}
                  dataSource={apiKeys}
                  pagination={false}
                  rowKey="id"
                />

                <Modal
                  title="Create New API Key"
                  visible={modalVisible}
                  onOk={handleCreateKey}
                  onCancel={() => setModalVisible(false)}
                >
                  <Form layout="vertical">
                    <Form.Item label="Key Name">
                      <Input
                        placeholder="e.g., Production - Python App"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </Form.Item>
                  </Form>
                </Modal>
              </Card>
            ),
          },
          {
            key: 'projects',
            label: (
              <span>
                <FileTextOutlined /> Projects
              </span>
            ),
            children: (
              <Card title="Your Projects">
                {projects.length > 0 ? (
                  <Table
                    columns={projectsColumns}
                    dataSource={projects}
                    pagination={false}
                    rowKey="id"
                  />
                ) : (
                  <Empty description="No projects yet">
                    <Button type="primary" onClick={() => navigate('/sdk')}>
                      Start a New Project
                    </Button>
                  </Empty>
                )}
              </Card>
            ),
          },
          {
            key: 'activity',
            label: (
              <span>
                <SecurityScanOutlined /> Activity Log
              </span>
            ),
            children: (
              <Card title="Access Activity">
                <Table
                  columns={accessLogsColumns}
                  dataSource={accessLogs}
                  pagination={{ pageSize: 10 }}
                  rowKey="id"
                />
              </Card>
            ),
          },
          {
            key: 'security',
            label: (
              <span>
                <LockOutlined /> Security
              </span>
            ),
            children: (
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card title="Change Password">
                    <Form layout="vertical">
                      <Form.Item label="Current Password">
                        <Input.Password placeholder="Enter current password" />
                      </Form.Item>
                      <Form.Item label="New Password">
                        <Input.Password placeholder="Enter new password" />
                      </Form.Item>
                      <Form.Item label="Confirm Password">
                        <Input.Password placeholder="Confirm new password" />
                      </Form.Item>
                      <Button type="primary">Update Password</Button>
                    </Form>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Two-Factor Authentication">
                    <Alert
                      message="Two-factor authentication is disabled"
                      type="warning"
                      showIcon
                      style={{ marginBottom: '16px' }}
                    />
                    <Paragraph>
                      Enhance your account security by enabling two-factor authentication (2FA).
                    </Paragraph>
                    <Button>Enable 2FA</Button>
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card title="Active Sessions">
                    <Table
                      columns={[
                        {
                          title: 'Device',
                          dataIndex: 'device',
                          key: 'device',
                          render: () => 'Chrome on macOS',
                        },
                        {
                          title: 'IP Address',
                          dataIndex: 'ip',
                          key: 'ip',
                          render: () => '192.168.1.100',
                        },
                        {
                          title: 'Last Active',
                          dataIndex: 'lastActive',
                          key: 'lastActive',
                          render: () => 'Just now',
                        },
                        {
                          title: 'Action',
                          key: 'action',
                          render: () => (
                            <Button size="small" danger>
                              Sign Out
                            </Button>
                          ),
                        },
                      ]}
                      dataSource={[{ id: '1' }]}
                      pagination={false}
                      rowKey="id"
                    />
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ProfilePage;
