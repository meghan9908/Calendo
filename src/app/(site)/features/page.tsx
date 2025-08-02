'use client';

export default function Features() {
    const features = [
        {
            title: 'Effortless Scheduling',
            description: 'Easily book meetings with just a few clicks.',
            icon: '📅',
        },
        {
            title: 'Calendar Integration',
            description: 'Sync seamlessly with Google, Outlook, and more.',
            icon: '🔗',
        },
        {
            title: 'Customizable Links',
            description: 'Share personalized scheduling links with your clients.',
            icon: '✨',
        },
    ];

    return (
        <section className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Why Choose Calendo?</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center w-full md:w-1/3"
                    >
                        <div className="text-5xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
