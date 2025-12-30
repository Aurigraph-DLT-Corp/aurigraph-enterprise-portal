/**
 * SDK Signup Page
 *
 * Developer registration and onboarding for Aurigraph SDK access
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Checkbox,
  Select,
  Steps,
  Alert,
  Space,
  Divider,
  Badge,
  Avatar,
  Tag,
  Progress,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  RocketOutlined,
  ShieldOutlined,
  BookOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import './SignupPage.css';

const { Title, Paragraph, Text } = Typography;

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  role: string;
  preferredLanguage: string[];
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<SignupFormData>>({});
  const [loading, setLoading] = useState(false);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleFormFinish = async (values: SignupFormData) => {
    setLoading(true);
    setFormData(values);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(3); // Move to success step
    }, 2000);
  };

  const programBenefits = [
    {
      icon: <CodeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      title: 'Complete SDK Documentation',
      description: 'Access all 9 guides with 6,400+ lines of production-ready code.',
    },
    {
      icon: <RocketOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      title: 'High Performance',
      description: 'gRPC service layer with 15.6x faster performance than REST.',
    },
    {
      icon: <ShieldOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      title: 'Quantum-Resistant',
      description: 'NIST Level 5 security with post-quantum cryptography.',
    },
    {
      icon: <BookOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      title: 'Learning Resources',
      description: 'Comprehensive guides for Python, Go, TypeScript, and gRPC.',
    },
  ];

  const onboardingSteps = [
    {
      title: 'Create Account',
      description: 'Register with your email and create a secure password',
    },
    {
      title: 'Select Preferences',
      description: 'Choose your preferred programming languages and use cases',
    },
    {
      title: 'Get SDK Access',
      description: 'Receive API keys and access tokens for SDK authentication',
    },
    {
      title: 'Start Building',
      description: 'Begin developing with Aurigraph SDKs immediately',
    },
  ];

  return (
    <div className="signup-page">
      {/* Hero Section */}
      <div className="signup-hero">
        <div className="signup-hero-content">
          <Title level={1} className="signup-hero-title">
            Join the Aurigraph Developer Community
          </Title>
          <Title level={2} className="signup-hero-subtitle">
            Access complete SDK documentation and build high-performance blockchain applications
          </Title>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="signup-benefits">
        <Row gutter={[32, 32]}>
          {programBenefits.map((benefit, idx) => (
            <Col xs={24} sm={12} lg={6} key={idx}>
              <Card className="benefit-card" hoverable>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px' }}>{benefit.icon}</div>
                  <Title level={5}>{benefit.title}</Title>
                  <Paragraph style={{ fontSize: '13px', color: '#666' }}>
                    {benefit.description}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider />

      {/* Main Signup Content */}
      <Row gutter={[48, 48]}>
        {/* Left Column: Onboarding Steps */}
        <Col xs={24} md={10}>
          <Card className="onboarding-card">
            <Title level={3}>Onboarding Process</Title>
            <Steps
              direction="vertical"
              current={currentStep}
              items={onboardingSteps.map((step) => ({
                title: step.title,
                description: step.description,
              }))}
            />
          </Card>

          {/* Quick Start Checklist */}
          <Card className="checklist-card" style={{ marginTop: '24px' }}>
            <Title level={4}>Pre-Signup Checklist</Title>
            <Space direction="vertical">
              <div className="checklist-item">
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text>Choose your primary programming language</Text>
              </div>
              <div className="checklist-item">
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text>Identify your use case (fintech, supply chain, etc)</Text>
              </div>
              <div className="checklist-item">
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text>Review SDK documentation requirements</Text>
              </div>
              <div className="checklist-item">
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text>Read terms and security best practices</Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Right Column: Signup Form */}
        <Col xs={24} md={14}>
          <Card className="signup-form-card">
            {currentStep === 0 && (
              <>
                <Title level={3}>Account Information</Title>
                <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                  Create your Aurigraph developer account to access SDKs and documentation
                </Paragraph>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleFormFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="John Doe"
                      size="large"
                      autoComplete="name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="you@example.com"
                      size="large"
                      type="email"
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: 'Please enter a password' },
                      { min: 12, message: 'Password must be at least 12 characters' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Enter a strong password"
                      size="large"
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[
                      { required: true, message: 'Please confirm your password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Confirm your password"
                      size="large"
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Company/Organization"
                    name="company"
                    rules={[{ required: true, message: 'Please enter your company name' }]}
                  >
                    <Input placeholder="Acme Inc." size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Your Role"
                    name="role"
                    rules={[{ required: true, message: 'Please select your role' }]}
                  >
                    <Select
                      placeholder="Select your role"
                      size="large"
                      options={[
                        { label: 'Software Engineer', value: 'engineer' },
                        { label: 'DevOps Engineer', value: 'devops' },
                        { label: 'Solutions Architect', value: 'architect' },
                        { label: 'Product Manager', value: 'pm' },
                        { label: 'CTO/Technical Lead', value: 'cto' },
                        { label: 'Other', value: 'other' },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Preferred Programming Languages"
                    name="preferredLanguage"
                    rules={[{ required: true, message: 'Please select at least one language' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select programming languages you use"
                      size="large"
                      options={[
                        { label: 'Python', value: 'python' },
                        { label: 'Go', value: 'go' },
                        { label: 'TypeScript/JavaScript', value: 'typescript' },
                        { label: 'Java', value: 'java' },
                        { label: 'C#', value: 'csharp' },
                        { label: 'Rust', value: 'rust' },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    name="agreeToTerms"
                    valuePropName="checked"
                    rules={[{ required: true, message: 'You must agree to the terms' }]}
                  >
                    <Checkbox>
                      I agree to the{' '}
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item name="agreeToMarketing" valuePropName="checked">
                    <Checkbox>
                      I want to receive SDK updates and technical newsletters
                    </Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      block
                      style={{ height: '48px', fontSize: '16px' }}
                    >
                      Create Account & Continue
                    </Button>
                  </Form.Item>

                  <Paragraph type="secondary" style={{ textAlign: 'center', fontSize: '12px' }}>
                    Already have an account?{' '}
                    <a href="/login">Sign in</a>
                  </Paragraph>
                </Form>
              </>
            )}

            {currentStep === 1 && (
              <>
                <Title level={3}>Developer Preferences</Title>
                <Paragraph type="secondary">
                  Hello, <strong>{formData.fullName}</strong>! Let's customize your SDK experience.
                </Paragraph>

                <Alert
                  message="We'll customize your onboarding based on your preferences"
                  type="info"
                  style={{ marginBottom: '24px' }}
                />

                <div className="preferences-display">
                  <div className="pref-item">
                    <Text strong>Email:</Text>
                    <Text> {formData.email}</Text>
                  </div>
                  <div className="pref-item">
                    <Text strong>Company:</Text>
                    <Text> {formData.company}</Text>
                  </div>
                  <div className="pref-item">
                    <Text strong>Role:</Text>
                    <Text> {formData.role}</Text>
                  </div>
                  <div className="pref-item">
                    <Text strong>Languages:</Text>
                    <Space>
                      {formData.preferredLanguage?.map((lang) => (
                        <Tag key={lang} color="blue">
                          {lang}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                </div>

                <Divider />

                <Title level={5}>Recommended SDK Guides</Title>
                <Card
                  style={{
                    marginBottom: '16px',
                    background: '#f5f5f5',
                  }}
                >
                  <Paragraph>
                    Based on your preferences, we recommend starting with:
                  </Paragraph>
                  <ul>
                    <li>REST API Reference - Foundation for all SDKs</li>
                    <li>
                      {formData.preferredLanguage?.includes('python')
                        ? 'Python SDK Guide'
                        : 'SDK Guide for your language'}
                    </li>
                    <li>Transactions Guide - Core operations</li>
                    <li>Your language's Advanced Guide - Production patterns</li>
                  </ul>
                </Card>

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => handleStepChange(2)}
                  style={{ height: '48px', fontSize: '16px' }}
                >
                  Get SDK Access Keys
                </Button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Title level={3}>SDK Access Keys</Title>
                <Alert
                  message="Your developer account has been created!"
                  type="success"
                  style={{ marginBottom: '24px' }}
                />

                <Card style={{ marginBottom: '24px', background: '#f0f5ff' }}>
                  <Title level={5}>API Key (Keep Private)</Title>
                  <Input
                    value="sk_dev_aurigraph_1234567890abcdefgh"
                    addonAfter={
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            'sk_dev_aurigraph_1234567890abcdefgh'
                          );
                        }}
                      >
                        Copy
                      </Button>
                    }
                    readOnly
                  />
                  <Paragraph type="secondary" style={{ marginTop: '8px', fontSize: '12px' }}>
                    Use this key to authenticate with Aurigraph APIs
                  </Paragraph>
                </Card>

                <Card style={{ marginBottom: '24px', background: '#f0f5ff' }}>
                  <Title level={5}>Access Token</Title>
                  <Input
                    value="at_dev_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    addonAfter={
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            'at_dev_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                          );
                        }}
                      >
                        Copy
                      </Button>
                    }
                    readOnly
                  />
                  <Paragraph type="secondary" style={{ marginTop: '8px', fontSize: '12px' }}>
                    JWT token for API authentication (valid for 24 hours)
                  </Paragraph>
                </Card>

                <Alert
                  message="Never share your API keys! They provide full access to your account."
                  type="warning"
                  style={{ marginBottom: '24px' }}
                />

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => handleStepChange(3)}
                  style={{ height: '48px', fontSize: '16px' }}
                >
                  Start Building
                </Button>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <Avatar
                    size={80}
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    style={{ backgroundColor: '#f0f0f0', marginBottom: '16px' }}
                  />
                  <Title level={2}>Welcome to Aurigraph!</Title>
                  <Paragraph style={{ fontSize: '16px', marginBottom: '32px' }}>
                    Your developer account is ready. Access all SDKs and documentation now.
                  </Paragraph>

                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={() => navigate('/sdk')}
                      style={{ height: '48px', fontSize: '16px' }}
                    >
                      View All SDK Guides
                    </Button>
                    <Button
                      size="large"
                      block
                      href="https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/tree/V12/rwat-sdk-typescript/docs/sdk/"
                      target="_blank"
                      icon={<GithubOutlined />}
                      style={{ height: '48px', fontSize: '16px' }}
                    >
                      View on GitHub
                    </Button>
                    <Button
                      size="large"
                      block
                      onClick={() => navigate('/profile')}
                      style={{ height: '48px', fontSize: '16px' }}
                    >
                      Go to Profile
                    </Button>
                  </Space>

                  <Paragraph style={{ marginTop: '32px', fontSize: '12px', color: '#999' }}>
                    A confirmation email has been sent to <strong>{formData.email}</strong>
                  </Paragraph>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SignupPage;
