// testimonials.tsx
'use client';

export default function Testimonials() {
    const testimonials = [
        {
            name: 'John Doe',
            feedback: 'Calendo has revolutionized the way I manage my meetings. Highly recommended!',
            avatar: '/avatar1.png', // Replace with your image paths
        },
        {
            name: 'Jane Smith',
            feedback: 'The simplicity and efficiency of Calendo make it a must-have tool.',
            avatar: '/avatar2.png',
        },
    ];

    return (
        <section className="mt-16 bg-gray-50 py-10">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">What Our Users Say</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg p-6 rounded-lg text-center w-full md:w-1/3"
                    >
                        <img
                            src={testimonial.avatar}
                            alt={`${testimonial.name}'s avatar`}
                            className="w-16 h-16 rounded-full mx-auto mb-4"
                        />
                        <p className="text-gray-600 mb-4">"{testimonial.feedback}"</p>
                        <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                    </div>
                ))}
            </div>
        </section>
    );
}
