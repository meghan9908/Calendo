'use client';

export default function PricingPlans() {
    const plans = [
        {
            title: 'Free',
            price: '$0',
            features: ['1 Calendar Integration', 'Basic Scheduling', 'Email Support'],
        },
        {
            title: 'Pro',
            price: '$12/month',
            features: ['3 Calendar Integrations', 'Advanced Scheduling', 'Priority Support'],
        },
        {
            title: 'Enterprise',
            price: 'Contact Us',
            features: ['Unlimited Integrations', 'Custom Solutions', 'Dedicated Support'],
        },
    ];

    return (
        <section className="mt-16 py-10 bg-gray-50">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Choose Your Plan</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-lg text-center p-6 w-full md:w-1/3"
                    >
                        <h3 className="text-xl font-semibold mb-4">{plan.title}</h3>
                        <p className="text-2xl font-bold text-blue-600 mb-4">{plan.price}</p>
                        <ul className="text-gray-600 mb-6">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="mb-2">- {feature}</li>
                            ))}
                        </ul>
                        <button className="bg-black text-white py-2 px-4 rounded-full">
                            {plan.price === 'Contact Us' ? 'Contact Us' : 'Get Started'}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
