package org.huecraft.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;
import org.huecraft.backend.entity.base.BaseAuditable;
import org.huecraft.backend.entity.enums.BookingStatus;
import org.huecraft.backend.entity.enums.BookingType;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "village_id", nullable = false)
    private Village village;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 20, nullable = false)
    private BookingType type;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "time_slot", length = 100)
    private String timeSlot;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private BookingStatus status;

    @Lob
    @Column(name = "note")
    private String note;
}
