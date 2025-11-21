
import Container from "@/components/common/Container";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {

    return (
        <Container bg="#F5F5F5">
            {children}
        </Container>
    );
}
