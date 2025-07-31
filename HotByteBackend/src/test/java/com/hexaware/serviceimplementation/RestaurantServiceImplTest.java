package com.hexaware.serviceimplementation;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.Collections;

import com.hexaware.dto.AddressDTO;
import com.hexaware.dto.RestaurantDTO;
import com.hexaware.dto.UserCreateDTO;
import com.hexaware.dto.UserDTO;
import com.hexaware.entity.Address;
import com.hexaware.entity.Restaurant;
import com.hexaware.entity.User;
import com.hexaware.enums.RestaurantStatus;
import com.hexaware.enums.UserRole;
import com.hexaware.enums.UserStatus;
import com.hexaware.mapper.AddressMapper;
import com.hexaware.mapper.RestaurantMapper;
import com.hexaware.mapper.UserMapper;
import com.hexaware.repository.*;
import com.hexaware.service.UserService;
import com.hexaware.serviceImplementation.RestaurantServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

public class RestaurantServiceImplTest {

    @InjectMocks
    private RestaurantServiceImpl restaurantService;

    @Mock private RestaurantRepository restaurantRepository;
    @Mock private MenuRepository menuRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private UserRepository userRepository;
    @Mock private AddressRepository addressRepository;
    @Mock private RestaurantMapper restaurantMapper;
    @Mock private AddressMapper addressMapper;
    @Mock private UserService userService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    //  Test registerRestaurant
    @Test
    void testRegisterRestaurant() {
        RestaurantDTO restaurantDTO = new RestaurantDTO();
        restaurantDTO.setRestaurantName("GAC");
        restaurantDTO.setLocation("Chennai");
        restaurantDTO.setDescription("Popular");
        restaurantDTO.setRating(4.5);
        restaurantDTO.setStatus("ACTIVE");

        UserCreateDTO userDTO = new UserCreateDTO();
        userDTO.setUsername("owner@example.com");
        userDTO.setPassword("password");
        userDTO.setRole(UserRole.RESTAURANT);
        userDTO.setStatus(UserStatus.ACTIVE);
        restaurantDTO.setUserdto(userDTO);

        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setStreet("123 Street");
        addressDTO.setCity("Chennai");
        addressDTO.setState("TN");
        addressDTO.setPincode("600001");
        restaurantDTO.setAddressdto(addressDTO);

        User createdUser = new User();
        createdUser.setUserId(1);
        createdUser.setUsername("owner@example.com");

        Restaurant restaurantEntity = new Restaurant();
        restaurantEntity.setRestaurantName("GAC");

        UserDTO createdUserDTO = new UserDTO();
        createdUserDTO.setUserId(1);

        Address address = new Address();
        address.setAddressId(1);

        when(userService.createUser(userDTO)).thenReturn(createdUserDTO);
        when(userRepository.findById(1)).thenReturn(Optional.of(createdUser));
        when(addressMapper.addressDtoToAddress(addressDTO)).thenReturn(address);
        when(addressRepository.save(address)).thenReturn(address);
        when(restaurantMapper.restaurantDtoToRestaurant(any())).thenReturn(restaurantEntity);
        when(restaurantRepository.save(any())).thenReturn(restaurantEntity);
        when(restaurantMapper.restaurantToRestaurantDto(any())).thenReturn(restaurantDTO);

        RestaurantDTO result = restaurantService.registerRestaurant(restaurantDTO);

        assertNotNull(result);
        assertEquals("GAC", result.getRestaurantName());
    }

    //  Test getRestaurantByUserName
    @Test
    void testGetRestaurantByUserName() {
        String username = "owner@example.com";
        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantName("GAC");

        RestaurantDTO dto = new RestaurantDTO();
        dto.setRestaurantName("GAC");

        when(restaurantRepository.findByUserUsername(username)).thenReturn(restaurant);
        when(restaurantMapper.restaurantToRestaurantDto(restaurant)).thenReturn(dto);

        RestaurantDTO result = restaurantService.getRestaurantByUserName(username);

        assertNotNull(result);
        assertEquals("GAC", result.getRestaurantName());
    }

    //  Test updateRestaurantStatus
    @Test
    void testUpdateRestaurantStatus() {
        int restaurantId = 1;
        Restaurant restaurant = new Restaurant();
        restaurant.setStatus(RestaurantStatus.INACTIVE);

        RestaurantDTO dto = new RestaurantDTO();
        dto.setStatus("ACTIVE");

        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));
        when(restaurantRepository.save(restaurant)).thenReturn(restaurant);
        when(restaurantMapper.restaurantToRestaurantDto(restaurant)).thenReturn(dto);

        RestaurantDTO result = restaurantService.updateRestaurantStatus(restaurantId, "ACTIVE");

        assertNotNull(result);
        assertEquals("ACTIVE", result.getStatus());
    }

    //  Test getRestaurant by ID
    @Test
    void testGetRestaurantById() {
        int id = 100;
        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantId(id);
        restaurant.setRestaurantName("GAC");

        RestaurantDTO dto = new RestaurantDTO();
        dto.setRestaurantName("GAC");

        when(restaurantRepository.findById(id)).thenReturn(Optional.of(restaurant));
        when(restaurantMapper.restaurantToRestaurantDto(restaurant)).thenReturn(dto);

        RestaurantDTO result = restaurantService.getRestaurant(id);

        assertNotNull(result);
        assertEquals("GAC", result.getRestaurantName());
    }

    //  Test updateRestaurant
    @Test
    void testUpdateRestaurant() {
        int restaurantId = 1;

        RestaurantDTO updateDTO = new RestaurantDTO();
        updateDTO.setRestaurantName("Updated Name");
        updateDTO.setLocation("New Location");
        updateDTO.setDescription("Updated Desc");
        updateDTO.setRating(4.2);
        updateDTO.setStatus("ACTIVE");

        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantId(restaurantId);

        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));
        when(restaurantRepository.save(any(Restaurant.class))).thenReturn(restaurant);
        when(restaurantMapper.restaurantToRestaurantDto(any())).thenReturn(updateDTO);

        RestaurantDTO result = restaurantService.updateRestaurant(restaurantId, updateDTO);

        assertEquals("Updated Name", result.getRestaurantName());
        assertEquals("New Location", result.getLocation());
    }

    // Test deleteRestaurant
    @Test
    void testDeleteRestaurant() {
        int id = 10;
        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantId(id);

        when(restaurantRepository.findById(id)).thenReturn(Optional.of(restaurant));

        restaurantService.deleteRestaurant(id);

        verify(menuRepository, times(1)).deleteByRestaurant(restaurant);
        verify(restaurantRepository, times(1)).delete(restaurant);
    }

    // Test updateRestaurantStatus with invalid status
    @Test
    void testUpdateRestaurantStatusWithInvalidValue() {
        int restaurantId = 2;
        Restaurant restaurant = new Restaurant();

        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));

        Exception exception = assertThrows(RuntimeException.class, () ->
            restaurantService.updateRestaurantStatus(restaurantId, "INVALID_STATUS")
        );

        assertTrue(exception.getMessage().contains("Invalid status"));
    }
}