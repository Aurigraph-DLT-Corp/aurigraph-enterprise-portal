import React, { useState, useEffect } from 'react';

// Token Topology Visualization Component - Customized per Token Type
const TokenTopology = ({ tokenType }) => {
    const [selectedToken, setSelectedToken] = useState(null);

    // Token-type-specific topology networks
    const topologyMap = {
        real_estate: {
            title: 'Real Estate Token Ecosystem Network',
            description: 'Real Estate Tokens connected to complementary asset classes',
            tokens: [
                { id: 'RET', name: 'Real Estate Token', connections: 'Connects to Carbon Credits (green buildings), Commodities (land resources), IP (architectural tech)', value: '$8.2M', color: 'blue', ecosystem: 'Property ownership, rental income, fractional shares' },
                { id: 'CCT-Link', name: 'Green Building Certifications', connections: 'LEED, BREEAM certified properties', value: '$1.2M', color: 'green', ecosystem: 'Eco-friendly properties reduce carbon footprint' },
                { id: 'CIT-Link', name: 'Land Resource Commodities', connections: 'Mining, agriculture, timber', value: '$2.1M', color: 'yellow', ecosystem: 'Land beneath property development' },
                { id: 'IPT-Link', name: 'Architectural Patents', connections: 'Design innovations, smart building systems', value: '$0.8M', color: 'purple', ecosystem: 'Building technology and design IP' }
            ]
        },
        commodities: {
            title: 'Commodity Index Token Network',
            description: 'Commodity Tokens connected to supply chain and resources',
            tokens: [
                { id: 'CIT', name: 'Commodity Index Token', connections: 'Metals, agricultural, energy, industrial', value: '$1.5M', color: 'yellow', ecosystem: 'Physical commodities with price oracles' },
                { id: 'RET-Link', name: 'Mining & Agriculture Land', connections: 'Real estate for extraction & farming', value: '$4.3M', color: 'blue', ecosystem: 'Physical locations of commodity production' },
                { id: 'CCT-Link', name: 'Sustainable Sourcing', connections: 'Carbon neutral production practices', value: '$0.9M', color: 'green', ecosystem: 'ESG compliant commodity sourcing' },
                { id: 'IPT-Link', name: 'Processing Patents', connections: 'Refining, manufacturing, delivery tech', value: '$1.1M', color: 'purple', ecosystem: 'Technology for commodity processing' }
            ]
        },
        carbon_credits: {
            title: 'Carbon Credit Token Ecosystem',
            description: 'Carbon Credits connected to environmental and renewable projects',
            tokens: [
                { id: 'CCT', name: 'Carbon Credit Token', connections: 'Verified emission reductions globally', value: '$2.7M', color: 'green', ecosystem: '1 CCT = 1 metric ton CO2 equivalent' },
                { id: 'RET-Link', name: 'Green Buildings', connections: 'LEED certified real estate reducing emissions', value: '$3.2M', color: 'blue', ecosystem: 'Energy-efficient properties lower carbon' },
                { id: 'CIT-Link', name: 'Renewable Energy Commodities', connections: 'Solar panels, wind turbines, batteries', value: '$2.8M', color: 'yellow', ecosystem: 'Clean energy commodities production' },
                { id: 'IPT-Link', name: 'Climate Tech Patents', connections: 'Solar, wind, carbon capture innovations', value: '$1.6M', color: 'purple', ecosystem: 'Environmental technology breakthroughs' }
            ]
        },
        intellectual_property: {
            title: 'IP Rights Token Marketplace',
            description: 'Intellectual Property Tokens connected to all industries',
            tokens: [
                { id: 'IPT', name: 'IP Rights Token', connections: 'Patents, copyrights, trademarks, secrets', value: '$0.4M', color: 'purple', ecosystem: 'Innovation monetization & licensing' },
                { id: 'RET-Link', name: 'Building Management Patents', connections: 'Smart home, IoT, architecture tech', value: '$1.9M', color: 'blue', ecosystem: 'Real estate technology innovations' },
                { id: 'CIT-Link', name: 'Manufacturing Patents', connections: 'Processing, extraction, energy tech', value: '$2.2M', color: 'yellow', ecosystem: 'Industrial production innovations' },
                { id: 'CCT-Link', name: 'Environmental Tech Patents', connections: 'Carbon capture, renewable energy, emissions reduction', value: '$3.1M', color: 'green', ecosystem: 'Climate solutions & green technology' }
            ]
        }
    };

    const topology = topologyMap[tokenType] || topologyMap.real_estate;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">🔗 {topology.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{topology.description}</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-4 min-h-80 flex flex-wrap gap-4 items-start">
                {topology.tokens.map((token) => (
                    <div
                        key={token.id}
                        onClick={() => setSelectedToken(selectedToken === token.id ? null : token.id)}
                        className={`w-44 p-4 rounded-lg cursor-pointer transition transform hover:scale-105 ${
                            selectedToken === token.id
                                ? `bg-${token.color}-100 border-2 border-${token.color}-600 shadow-lg`
                                : `bg-white border-2 border-gray-300 hover:border-${token.color}-400`
                        }`}
                    >
                        <div className={`text-2xl font-bold text-${token.color}-600`}>{token.id}</div>
                        <div className="font-medium text-gray-800 text-sm mt-1">{token.name}</div>
                        <div className="text-xs text-gray-600 mt-2">Value: {token.value}</div>
                        <div className="text-xs text-gray-700 mt-1 font-semibold">Role:</div>
                        <div className="text-xs text-gray-600">{token.ecosystem}</div>
                    </div>
                ))}
            </div>

            {selectedToken && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-800 text-lg">
                        {topology.tokens.find(t => t.id === selectedToken)?.name}
                    </h4>
                    <p className="text-sm text-gray-700 mt-2">
                        <strong>Ecosystem Role:</strong> {topology.tokens.find(t => t.id === selectedToken)?.ecosystem}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                        <strong>Connections:</strong> {topology.tokens.find(t => t.id === selectedToken)?.connections}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                        <strong>Market Value:</strong> {topology.tokens.find(t => t.id === selectedToken)?.value}
                    </p>
                </div>
            )}
        </div>
    );
};

const Dashboard = ({ module }) => {
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, [module]);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8001/api/metrics/${module}`);
            const data = await response.json();
            setMetrics(data);
        } catch (error) {
            // Use mock data
            setMetrics(getMockMetrics(module));
        }
        setLoading(false);
    };

    const getMockMetrics = (module) => {
        const mockData = {
            dashboard: {
                title: 'Executive Dashboard',
                cards: [
                    { title: 'Active Projects', value: '24', trend: '+12%', color: 'blue' },
                    { title: 'GNN Models', value: '4', trend: 'Active', color: 'green' },
                    { title: 'Carbon Footprint', value: '125 tCO2', trend: '-8%', color: 'yellow' },
                    { title: 'System Health', value: '98%', trend: 'Stable', color: 'green' }
                ]
            },
            gnn: {
                title: 'GNN Analytics',
                cards: [
                    { title: 'Supply Chain', value: '96%', trend: 'Accuracy', color: 'blue' },
                    { title: 'Water Management', value: '4.2%', trend: 'MAPE', color: 'cyan' },
                    { title: 'Carbon Credits', value: '98%', trend: 'Verified', color: 'green' },
                    { title: 'Forest Health', value: '0.87', trend: 'Index', color: 'green' }
                ]
            },
            sustainability: {
                title: 'Sustainability Metrics',
                cards: [
                    { title: 'Carbon Saved', value: '450 tCO2', trend: '+15%', color: 'green' },
                    { title: 'Water Conserved', value: '2.5M L', trend: '+22%', color: 'blue' },
                    { title: 'Energy Reduced', value: '35%', trend: '+5%', color: 'yellow' },
                    { title: 'Compliance Score', value: '95%', trend: 'Compliant', color: 'green' }
                ]
            },
            agents: {
                title: 'AI Agent Control',
                cards: [
                    { title: 'Active Agents', value: '15', trend: 'Running', color: 'green' },
                    { title: 'Missions Complete', value: '24', trend: '+3 today', color: 'blue' },
                    { title: 'Success Rate', value: '96%', trend: 'High', color: 'green' },
                    { title: 'Avg Response', value: '95ms', trend: 'Fast', color: 'yellow' }
                ]
            },
            tokens: {
                title: 'Token Experience - RWAT & Digital Assets',
                cards: [
                    { title: 'Total Tokens', value: '2.4M', trend: '+8.5%', color: 'blue' },
                    { title: 'Active Assets', value: '456', trend: '+12 this week', color: 'purple' },
                    { title: 'Token Value', value: '$12.8M', trend: '+3.2%', color: 'green' },
                    { title: 'Transaction Volume', value: '8.2K', trend: '+15% 24h', color: 'cyan' }
                ]
            }
        };
        return mockData[module] || mockData.dashboard;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">{metrics.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.cards?.map((card, index) => (
                    <div key={index} className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${card.color}-500`}>
                        <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
                        <p className="text-3xl font-bold mt-2">{card.value}</p>
                        <p className={`text-sm mt-2 text-${card.color}-600`}>{card.trend}</p>
                    </div>
                ))}
            </div>
            <ModuleContent module={module} />
        </div>
    );
};

const ModuleContent = ({ module }) => {
    const moduleNames = {
        tokens: 'Token Experience',
        gnn: 'GNN Analytics',
        sustainability: 'Sustainability Metrics',
        agents: 'AI Agent Control',
        dashboard: 'Executive Dashboard'
    };

    const renderContent = () => {
        switch(module) {
            case 'tokens':
                return <TokenModule />;
            case 'gnn':
                return <GNNModule />;
            case 'sustainability':
                return <SustainabilityModule />;
            case 'agents':
                return <AgentModule />;
            default:
                return <DashboardCharts />;
        }
    };

    return (
        <div className="mt-8 space-y-6">
            {renderContent()}

            {/* Social Sharing - Available for All Modules */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">📢</div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Share This Module</h3>
                        <p className="text-sm text-gray-600">Share the {moduleNames[module] || 'Dashboard'} with your network</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out the ${moduleNames[module] || 'Aurigraph Dashboard'}! Exploring advanced analytics at https://dlt.aurigraph.io&hashtags=Aurigraph,DLT,Analytics`, '_blank')}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                        <span>𝕏</span> Tweet
                    </button>
                    <button
                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://dlt.aurigraph.io`, '_blank')}
                        className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition font-medium"
                    >
                        <span>in</span> LinkedIn
                    </button>
                    <button
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https://dlt.aurigraph.io`, '_blank')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <span>f</span> Facebook
                    </button>
                    <button
                        onClick={() => window.open(`mailto:?subject=Check out Aurigraph's ${moduleNames[module] || 'Dashboard'}&body=I discovered this amazing analytics platform. Check it out: https://dlt.aurigraph.io`)}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
                    >
                        <span>✉</span> Email
                    </button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText('https://dlt.aurigraph.io');
                            alert('Link copied to clipboard!');
                        }}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                        <span>🔗</span> Copy Link
                    </button>
                </div>
            </div>

            {/* Feedback - Available for All Modules */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">⭐</div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Rate This Module</h3>
                        <p className="text-sm text-gray-600">Help us improve {moduleNames[module] || 'the dashboard'}</p>
                    </div>
                </div>
                <ModuleFeedbackForm module={module} moduleName={moduleNames[module]} />
            </div>
        </div>
    );
};

const DashboardCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Performance Trends</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50">
                <canvas id="performanceChart"></canvas>
            </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Resource Utilization</h3>
            <div className="space-y-4">
                <ResourceBar label="CPU" value={45} color="blue" />
                <ResourceBar label="Memory" value={62} color="green" />
                <ResourceBar label="Storage" value={78} color="yellow" />
                <ResourceBar label="Network" value={35} color="purple" />
            </div>
        </div>
    </div>
);

const ResourceBar = ({ label, value, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-1">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`bg-${color}-500 h-2 rounded-full`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const GNNModule = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">GNN Model Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => testPrediction('supply_chain')}>
                Test Supply Chain Prediction
            </button>
            <button className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
                    onClick={() => testPrediction('water_management')}>
                Test Water Management
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => testPrediction('carbon_credit')}>
                Test Carbon Credits
            </button>
            <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
                    onClick={() => testPrediction('forest_ecosystem')}>
                Test Forest Ecosystem
            </button>
        </div>
        <div id="predictionResult" className="mt-4 p-4 bg-gray-50 rounded"></div>
    </div>
);

const SustainabilityModule = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">LCA/PCF Calculator</h3>
        <div className="space-y-4">
            <input type="text" placeholder="Product ID" className="w-full p-2 border rounded" />
            <input type="number" placeholder="Weight (kg)" className="w-full p-2 border rounded" />
            <select className="w-full p-2 border rounded">
                <option>Select Material</option>
                <option>Steel</option>
                <option>Aluminum</option>
                <option>Plastic</option>
                <option>Wood</option>
            </select>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                Calculate Carbon Footprint
            </button>
        </div>
    </div>
);

const AgentModule = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Active AI Agents</h3>
        <div className="space-y-2">
            {[
                { name: 'Senior Architect', status: 'Active', tasks: 156 },
                { name: 'Security Ops', status: 'Active', tasks: 234 },
                { name: 'Neural Network', status: 'Busy', tasks: 45 },
                { name: 'DevOps', status: 'Active', tasks: 267 },
                { name: 'Data Engineering', status: 'Idle', tasks: 189 }
            ].map((agent, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">{agent.name}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                        agent.status === 'Active' ? 'bg-green-100 text-green-800' :
                        agent.status === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>{agent.status}</span>
                    <span className="text-sm text-gray-600">{agent.tasks} tasks</span>
                </div>
            ))}
        </div>
    </div>
);

// Voice Over Guide Component - Customized per Token Type
const VoiceOverGuide = ({ tokenType }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const speechSynthesisRef = React.useRef(null);

    // Token-type-specific narratives
    const narrativeMap = {
        real_estate: [
            {
                title: 'Real Estate Tokenization',
                text: 'Real Estate Tokens (RET) convert property ownership into blockchain-based digital assets. Instead of traditional real estate investment requiring large capital and complex paperwork, you can now own fractional shares of premium properties globally.'
            },
            {
                title: 'Property Valuation',
                text: 'Each property is professionally appraised and its value is locked on the blockchain. The total property value is divided into individual tokens. For example, a $1 million property might be divided into 1 million tokens worth $1 each, allowing democratic access to real estate investment.'
            },
            {
                title: 'Fractional Ownership',
                text: 'With Real Estate Tokens, you don\'t need to own an entire property. You can own 1%, 5%, or 50% of a property through token holdings. This dramatically lowers the barrier to entry for real estate investment while maintaining full transparency on the blockchain.'
            },
            {
                title: 'Rental Income Distribution',
                text: 'Property rental income is automatically distributed to token holders proportionally. If you own 10% of the tokens, you receive 10% of monthly rental income directly to your wallet. Payments are smart contract-enforced for guaranteed, timely distributions.'
            },
            {
                title: 'RET Ecosystem Connections',
                text: 'Real Estate Tokens connect to Carbon Credit Tokens through green building certifications, Commodity Tokens via land resources, and IP Rights through architectural patents. This interconnected ecosystem enables sophisticated hedging and diversification strategies.'
            },
            {
                title: 'Trading & Liquidity',
                text: 'Unlike traditional real estate, your RET tokens are highly liquid. You can sell your property shares instantly on the blockchain market. Price discovery happens in real-time as supply and demand dynamics play out across the global token market.'
            },
            {
                title: 'Tax & Compliance',
                text: 'All Real Estate Token transactions are recorded on the immutable blockchain ledger, providing complete audit trails for tax authorities and regulators. Automatic compliance reporting and transparent ownership records simplify tax obligations for investors worldwide.'
            }
        ],
        commodities: [
            {
                title: 'Commodity Index Tokenization',
                text: 'Commodity Index Tokens (CIT) represent fractional ownership of baskets of physical goods like metals, agricultural products, and energy resources. Instead of managing commodity futures contracts, you directly own underlying physical commodities through tokens.'
            },
            {
                title: 'Commodity Types',
                text: 'Our platform supports multiple commodity categories: Precious Metals like gold and silver, Agricultural Products such as wheat and coffee, Energy Commodities including oil and natural gas, and Industrial Materials like copper and lithium for technology manufacturing.'
            },
            {
                title: 'Price Oracle Integration',
                text: 'Each Commodity Token is linked to trusted price oracles that feed real-time commodity prices from global markets. Prices update every minute based on major exchanges. This ensures your token value always reflects current market conditions across London, New York, and Shanghai exchanges.'
            },
            {
                title: 'Physical Storage & Insurance',
                text: 'Tokenized commodities are stored in secure, insured warehouses managed by certified custodians. Insurance covers 100% of commodity value against theft, damage, and natural disasters. You maintain full ownership rights while eliminating storage and security concerns.'
            },
            {
                title: 'CIT Supply Chain Network',
                text: 'Commodity Tokens connect to Real Estate Tokens through mining and agriculture land operations, Carbon Credits via sustainable sourcing practices, and IP Rights through processing patents. This creates transparent supply chains from extraction to market.'
            },
            {
                title: 'Hedging & Portfolio Protection',
                text: 'Use Commodity Tokens as inflation hedges in your investment portfolio. When traditional assets decline, commodities often appreciate, providing portfolio balance. Cross-commodity correlations help you build diversified holdings that protect against market volatility.'
            },
            {
                title: 'Delivery & Settlement',
                text: 'You can hold Commodity Tokens indefinitely or redeem them for physical delivery. Physical settlement happens within 30 days at any registered warehouse. This real-world backing distinguishes our commodity tokens from purely speculative digital assets.'
            }
        ],
        carbon_credits: [
            {
                title: 'Carbon Credit Tokenization',
                text: 'Carbon Credit Tokens (CCT) represent verified greenhouse gas emission reductions. One CCT equals one metric ton of CO2 equivalent reduced or removed from the atmosphere. These verified environmental assets are now tradeable on blockchain with full transparency and verification.'
            },
            {
                title: 'Project Verification',
                text: 'Every carbon credit underlying our CCT tokens comes from verified environmental projects: renewable energy installations reducing fossil fuel use, reforestation programs capturing atmospheric carbon, methane capture from landfills, and industrial emission reduction projects. Third-party auditors verify all claims.'
            },
            {
                title: 'Impact Measurement',
                text: 'Each Carbon Credit Token includes verifiable impact data: exact location of the reduction project, baseline emissions before the project, documented reductions achieved, and ongoing monitoring data. Blockchain ensures this data cannot be altered, providing absolute transparency for impact investors.'
            },
            {
                title: 'Compliance & Retirement',
                text: 'Corporations and governments purchasing CCT tokens can retire them to meet climate commitments and regulatory requirements. Retired credits are permanently marked on the blockchain, preventing resale and ensuring environmental integrity. Compliance reporting is automatic and auditable.'
            },
            {
                title: 'CCT Ecosystem Integration',
                text: 'Carbon Credits connect to Real Estate Tokens through green buildings, Commodities via sustainable sourcing and renewable energy, and IP Rights through climate technology patents. Companies can hedge environmental risks while supporting sustainable practices across supply chains.'
            },
            {
                title: 'Price Discovery & Markets',
                text: 'CCT token prices reflect the real economic value of carbon reduction. As climate regulations tighten globally, demand for verified carbon credits increases, creating price appreciation opportunities. Active token markets provide price signals that reward environmental action.'
            },
            {
                title: 'Climate Commitment Made Easy',
                text: 'Organizations can now achieve carbon neutrality by purchasing and retiring CCT tokens instead of expensive on-site emissions reductions. Blockchain provides irrefutable proof of climate commitment. Scale your environmental impact from local projects to global decarbonization initiatives.'
            }
        ],
        intellectual_property: [
            {
                title: 'IP Rights Tokenization',
                text: 'Intellectual Property Rights Tokens (IPT) convert ownership of patents, trademarks, copyrights, and trade secrets into tradeable blockchain assets. Creators and IP holders can now monetize their innovation by selling fractional ownership or licensing rights through tokens.'
            },
            {
                title: 'IP Categories',
                text: 'Our platform supports Software Patents for algorithms and systems, Hardware Patents for mechanical innovations, Copyrights for creative works including music and literature, Trademarks for brand assets and logos, and Trade Secrets for proprietary processes and formulations.'
            },
            {
                title: 'Royalty Stream Distribution',
                text: 'IPT token holders receive automatic royalty payments whenever the underlying IP generates revenue. A musician tokenizes their song rights; fans owning tokens receive portions of streaming revenue. Blockchain ensures instant, transparent distribution without intermediaries taking cuts.'
            },
            {
                title: 'IP Valuation & Licensing',
                text: 'IP tokens are valued based on historical royalty generation, market size, and competitive advantage. Token prices reflect the capitalized value of future licensing revenue. Companies can license IPT-backed technology directly from token holders globally, reducing legal friction.'
            },
            {
                title: 'IPT Cross-Chain Connections',
                text: 'IP Rights Tokens connect to Real Estate through technology in building management systems, Commodities via processing and manufacturing patents, and Carbon Credits through environmental technology innovations. This creates value chains where innovation drives environmental and economic benefits.'
            },
            {
                title: 'Creator Empowerment',
                text: 'Innovators and creators can now fund development through token sales to supporters who believe in their IP\'s potential. This democratizes venture capital, allowing grassroots innovation funding without traditional VC gatekeeping or dilutive equity requirements.'
            },
            {
                title: 'Global IP Marketplace',
                text: 'Blockchain eliminates geographic barriers to IP commercialization. A developer in Singapore can instantly license patented technology to companies in Brazil using IPT tokens. Instant settlement and transparent terms make global IP commerce accessible to everyone.'
            }
        ]
    };

    const narrativeSteps = narrativeMap[tokenType] || narrativeMap.real_estate;

    const speak = (text, stepIndex) => {
        // Cancel any previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setCurrentStep(stepIndex);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            // Auto-advance to next step
            if (stepIndex < narrativeSteps.length - 1) {
                setTimeout(() => {
                    speak(narrativeSteps[stepIndex + 1].text, stepIndex + 1);
                }, 500);
            } else {
                setIsPlaying(false);
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            setIsSpeaking(false);
        };

        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
            setIsSpeaking(false);
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                setIsPlaying(true);
                setIsSpeaking(true);
            } else {
                setIsPlaying(true);
                speak(narrativeSteps[currentStep].text, currentStep);
            }
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsSpeaking(false);
        setCurrentStep(0);
    };

    const handleStepClick = (stepIndex) => {
        window.speechSynthesis.cancel();
        setCurrentStep(stepIndex);
        setIsPlaying(true);
        speak(narrativeSteps[stepIndex].text, stepIndex);
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">🎙️</div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Interactive Voice Guide</h3>
                        <p className="text-sm text-gray-600">Learn about tokenization with audio narration</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePlayPause}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            isPlaying
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        {isPlaying ? '⏸ Pause' : '▶ Play'}
                    </button>
                    <button
                        onClick={handleStop}
                        className="px-4 py-2 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition"
                    >
                        ⏹ Stop
                    </button>
                </div>
            </div>

            {/* Current Step Display */}
            <div className="bg-white rounded-lg p-4 mb-4 border-2 border-blue-200">
                <h4 className="text-lg font-semibold text-blue-700 mb-2">
                    Step {currentStep + 1}: {narrativeSteps[currentStep].title}
                </h4>
                <p className="text-gray-700 leading-relaxed">{narrativeSteps[currentStep].text}</p>
                {isSpeaking && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0s' }}></div>
                            <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-sm text-blue-600 font-medium">Currently speaking...</span>
                    </div>
                )}
            </div>

            {/* Step Navigation */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Jump to step:</p>
                <div className="flex flex-wrap gap-2">
                    {narrativeSteps.map((step, index) => (
                        <button
                            key={index}
                            onClick={() => handleStepClick(index)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                currentStep === index
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                            }`}
                        >
                            {index + 1}. {step.title.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / narrativeSteps.length) * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                    {currentStep + 1} of {narrativeSteps.length} steps
                </p>
            </div>
        </div>
    );
};

const TokenModule = () => {
    const [tokenizationResult, setTokenizationResult] = useState(null);
    const [selectedTokenType, setSelectedTokenType] = useState('real_estate');

    const handleTokenizeAsset = (assetType) => {
        // Set the selected token type to show relevant guides and topology
        setSelectedTokenType(assetType);

        const messages = {
            real_estate: 'Real estate asset tokenized: 125.5K RET tokens minted and distributed to vault',
            commodities: 'Commodity tokenization complete: 50K CIT tokens created with price oracle linked',
            carbon_credits: 'Carbon credits tokenized: 100K CCT tokens verified and registered',
            intellectual_property: 'IP rights tokenized: 42.1K IPT tokens created with royalty contracts'
        };

        setTokenizationResult({
            type: 'success',
            message: messages[assetType] || 'Asset tokenization initiated'
        });

        setTimeout(() => setTokenizationResult(null), 5000);
    };

    return (
        <div className="space-y-6">
            <VoiceOverGuide tokenType={selectedTokenType} />
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">🪙 Real-World Asset Tokenization (RWAT)</h3>
                <p className="text-gray-600 mb-4">Select a token type to see its dedicated voice guide and ecosystem topology</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className={`px-4 py-3 rounded-lg font-medium transition border-2 ${
                        selectedTokenType === 'real_estate'
                            ? 'bg-blue-600 text-white border-blue-700 shadow-lg'
                            : 'bg-blue-500 text-white border-transparent hover:bg-blue-600'
                    }`}
                            onClick={() => handleTokenizeAsset('real_estate')}>
                        {selectedTokenType === 'real_estate' && '✓ '} Real Estate Tokens (RET)
                    </button>
                    <button className={`px-4 py-3 rounded-lg font-medium transition border-2 ${
                        selectedTokenType === 'commodities'
                            ? 'bg-yellow-600 text-white border-yellow-700 shadow-lg'
                            : 'bg-yellow-500 text-white border-transparent hover:bg-yellow-600'
                    }`}
                            onClick={() => handleTokenizeAsset('commodities')}>
                        {selectedTokenType === 'commodities' && '✓ '} Commodity Tokens (CIT)
                    </button>
                    <button className={`px-4 py-3 rounded-lg font-medium transition border-2 ${
                        selectedTokenType === 'carbon_credits'
                            ? 'bg-green-600 text-white border-green-700 shadow-lg'
                            : 'bg-green-500 text-white border-transparent hover:bg-green-600'
                    }`}
                            onClick={() => handleTokenizeAsset('carbon_credits')}>
                        {selectedTokenType === 'carbon_credits' && '✓ '} Carbon Credit Tokens (CCT)
                    </button>
                    <button className={`px-4 py-3 rounded-lg font-medium transition border-2 ${
                        selectedTokenType === 'intellectual_property'
                            ? 'bg-purple-600 text-white border-purple-700 shadow-lg'
                            : 'bg-purple-500 text-white border-transparent hover:bg-purple-600'
                    }`}
                            onClick={() => handleTokenizeAsset('intellectual_property')}>
                        {selectedTokenType === 'intellectual_property' && '✓ '} IP Rights Tokens (IPT)
                    </button>
                </div>
                {tokenizationResult && (
                    <div className="mt-4 p-4 bg-green-50 rounded border-l-4 border-green-500 text-sm">
                        <span className="font-semibold text-green-800">✅ Success: </span>
                        <span className="text-green-700">{tokenizationResult.message}</span>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Token Portfolio</h3>
                <div className="space-y-3">
                    {[
                        { name: 'Real Estate Token (RET)', balance: '125.5K', value: '$8.2M', status: 'Active' },
                        { name: 'Carbon Credit Token (CCT)', balance: '450K', value: '$2.7M', status: 'Active' },
                        { name: 'Commodity Index Token (CIT)', balance: '89.3K', value: '$1.5M', status: 'Verified' },
                        { name: 'IP Rights Token (IPT)', balance: '42.1K', value: '$0.4M', status: 'Pending' }
                    ].map((token, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                            <div>
                                <div className="font-medium text-gray-800">{token.name}</div>
                                <div className="text-sm text-gray-500">Balance: {token.balance}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-gray-800">{token.value}</div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    token.status === 'Active' ? 'bg-green-100 text-green-800' :
                                    token.status === 'Verified' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>{token.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TokenTopology tokenType={selectedTokenType} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Token Transactions</h3>
                <div className="space-y-2">
                    {[
                        { type: 'Transfer', from: 'Portfolio', to: 'Exchange', amount: '50K RET', timestamp: '2 hours ago', status: 'Confirmed' },
                        { type: 'Mint', from: 'Contract', to: 'Vault', amount: '100K CCT', timestamp: '4 hours ago', status: 'Confirmed' },
                        { type: 'Burn', from: 'Portfolio', to: 'Null', amount: '25K CIT', timestamp: '1 day ago', status: 'Confirmed' },
                        { type: 'Stake', from: 'Wallet', to: 'Farm', amount: '200K IPT', timestamp: '2 days ago', status: 'Active' }
                    ].map((tx, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                            <div className="flex-1">
                                <div className="font-medium">{tx.type}: {tx.amount}</div>
                                <div className="text-xs text-gray-500">{tx.from} → {tx.to} · {tx.timestamp}</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                tx.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Social Sharing Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">📢</div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Share Your Token Journey</h3>
                        <p className="text-sm text-gray-600">Tell your network about {selectedTokenType === 'real_estate' ? 'Real Estate' : selectedTokenType === 'commodities' ? 'Commodity' : selectedTokenType === 'carbon_credits' ? 'Carbon Credit' : 'IP Rights'} Tokenization</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=I'm exploring Real-World Asset Tokenization on Aurigraph! Decentralized ownership of ${selectedTokenType === 'real_estate' ? 'real estate properties' : selectedTokenType === 'commodities' ? 'physical commodities' : selectedTokenType === 'carbon_credits' ? 'verified carbon credits' : 'intellectual property'}. Check it out: https://dlt.aurigraph.io/demo/token-experience&hashtags=RWAT,Blockchain,Tokenization`, '_blank')}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                        <span>𝕏</span> Tweet
                    </button>
                    <button
                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://dlt.aurigraph.io/demo/token-experience`, '_blank')}
                        className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition font-medium"
                    >
                        <span>in</span> LinkedIn
                    </button>
                    <button
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https://dlt.aurigraph.io/demo/token-experience`, '_blank')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <span>f</span> Facebook
                    </button>
                    <button
                        onClick={() => window.open(`mailto:?subject=Check out Real-World Asset Tokenization&body=I discovered Aurigraph's RWAT platform. Learn more: https://dlt.aurigraph.io/demo/token-experience`)}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
                    >
                        <span>✉</span> Email
                    </button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText('https://dlt.aurigraph.io/demo/token-experience');
                            alert('Link copied to clipboard!');
                        }}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                        <span>🔗</span> Copy Link
                    </button>
                </div>
            </div>

            {/* Feedback & Ratings Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">⭐</div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Rate Your Experience</h3>
                        <p className="text-sm text-gray-600">Help us improve the Token Experience module</p>
                    </div>
                </div>

                <FeedbackForm tokenType={selectedTokenType} />
            </div>
        </div>
    );
};

// Feedback Form Component
const FeedbackForm = ({ tokenType }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [feedbackType, setFeedbackType] = useState('general');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please provide a star rating');
            return;
        }

        // Log feedback for submission
        console.log({
            tokenType,
            rating,
            feedbackType,
            feedback,
            timestamp: new Date().toISOString()
        });

        setSubmitted(true);
        setTimeout(() => {
            setRating(0);
            setFeedback('');
            setFeedbackType('general');
            setSubmitted(false);
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Rate this experience</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="text-3xl transition transform hover:scale-110"
                        >
                            {star <= (hoverRating || rating) ? '⭐' : '☆'}
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <p className="text-sm text-gray-600">
                        You rated this {rating} star{rating > 1 ? 's' : ''}
                        {rating >= 4 && ' - Great!'}
                        {rating === 3 && ' - Good feedback!'}
                        {rating <= 2 && ' - Help us improve'}
                    </p>
                )}
            </div>

            {/* Feedback Type */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Feedback type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                        { value: 'general', label: 'General' },
                        { value: 'suggestion', label: 'Suggestion' },
                        { value: 'bug', label: 'Bug Report' },
                        { value: 'feature', label: 'Feature Request' }
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setFeedbackType(option.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                feedbackType === option.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback Text */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Your feedback (optional)</label>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    maxLength={500}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500">{feedback.length}/500 characters</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    {submitted ? '✓ Feedback Submitted' : 'Submit Feedback'}
                </button>
                <button
                    type="button"
                    onClick={() => setFeedback('')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                    Clear
                </button>
            </div>

            {submitted && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    <strong>Thank you!</strong> Your feedback helps us improve the Token Experience module.
                </div>
            )}
        </form>
    );
};

// Module-agnostic feedback form for all dashboard modules
const ModuleFeedbackForm = ({ module, moduleName }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('general');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please provide a star rating');
            return;
        }

        // Log feedback to console (can be connected to backend API later)
        console.log({
            module,
            moduleName,
            rating,
            feedbackType,
            feedback,
            timestamp: new Date().toISOString()
        });

        // Show success message
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setRating(0);
            setFeedback('');
            setFeedbackType('general');
            setSubmitted(false);
        }, 3000);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4"
        >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Share Your Feedback on {moduleName}
            </h3>

            {/* Star Rating */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">How would you rate this feature?</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-3xl transition ${
                                star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400`}
                        >
                            ★
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <p className="text-sm text-gray-600">
                        You rated this {rating} star{rating > 1 ? 's' : ''}
                        {rating >= 4 && ' - Great!'}
                        {rating === 3 && ' - Good feedback!'}
                        {rating <= 2 && ' - Help us improve'}
                    </p>
                )}
            </div>

            {/* Feedback Type */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Feedback type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                        { value: 'general', label: 'General' },
                        { value: 'suggestion', label: 'Suggestion' },
                        { value: 'bug', label: 'Bug Report' },
                        { value: 'feature', label: 'Feature Request' }
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setFeedbackType(option.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                feedbackType === option.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback Text */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Your feedback (optional)</label>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    maxLength={500}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500">{feedback.length}/500 characters</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    {submitted ? '✓ Feedback Submitted' : 'Submit Feedback'}
                </button>
                <button
                    type="button"
                    onClick={() => setFeedback('')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                    Clear
                </button>
            </div>

            {submitted && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    <strong>Thank you!</strong> Your feedback on {moduleName} helps us improve.
                </div>
            )}
        </form>
    );
};

const testPrediction = async (modelType) => {
    try {
        const response = await fetch('http://localhost:8000/api/gnn/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model_type: modelType, data: { test: true } })
        });
        const result = await response.json();
        document.getElementById('predictionResult').innerHTML =
            `<strong>Result:</strong> ${JSON.stringify(result.prediction, null, 2)}`;
    } catch (error) {
        console.error('Prediction failed:', error);
    }
};

export default Dashboard;
