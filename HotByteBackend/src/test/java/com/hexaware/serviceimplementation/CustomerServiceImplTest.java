package com.hexaware.serviceimplementation;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.hexaware.dto.AddressDTO;
import com.hexaware.dto.CustomerDTO;
import com.hexaware.dto.UserCreateDTO;
import com.hexaware.dto.UserDTO;
import com.hexaware.entity.Address;
import com.hexaware.entity.Customer;
import com.hexaware.entity.User;
import com.hexaware.enums.UserRole;
import com.hexaware.mapper.AddressMapper;
import com.hexaware.mapper.CustomerMapper;
import com.hexaware.repository.AddressRepository;
import com.hexaware.repository.CustomerRepository;
import com.hexaware.repository.UserRepository;
import com.hexaware.service.UserService;
import com.hexaware.serviceImplementation.CustomerServiceImpl;

public class CustomerServiceImplTest {

    @InjectMocks
    private CustomerServiceImpl customerService;

    @Mock
    private UserService userService;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerMapper customerMapper;

    @Mock
    private AddressMapper addressMapper;

    private CustomerDTO customerDTO;
    private UserCreateDTO userCreateDTO;
    private User user;
    private Address address;
    private Customer customer;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        userCreateDTO = new UserCreateDTO();
        userCreateDTO.setUsername("john@example.com");
        userCreateDTO.setPassword("pass123");
        userCreateDTO.setRole(UserRole.CUSTOMER);

        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(1);
        userDTO.setUsername("john@example.com");

        user = new User();
        user.setUserId(1);

        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setStreet("123 Main St");
        addressDTO.setCity("City");
        addressDTO.setState("State");
        addressDTO.setPincode("123456");

        address = new Address();
        address.setAddressId(1);

        customerDTO = new CustomerDTO();
        customerDTO.setUserdto(userCreateDTO);
        customerDTO.setAddress(addressDTO);
        customerDTO.setFullName("John Doe");

        customer = new Customer();
        customer.setCustomerId(1);
        customer.setUser(user);
        customer.setAddress(address);

        // Mock behavior for registration
        when(userService.createUser(userCreateDTO)).thenReturn(userDTO);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(addressMapper.addressDtoToAddress(addressDTO)).thenReturn(address);
        when(addressRepository.save(address)).thenReturn(address);
        when(customerMapper.customerDtoToCustomer(customerDTO)).thenReturn(customer);
        when(customerRepository.save(customer)).thenReturn(customer);
        when(customerMapper.customerToCustomerDto(customer)).thenReturn(customerDTO);
    }

    @Test
    void testRegisterCustomer() {
        CustomerDTO result = customerService.registerCustomer(customerDTO);
        assertNotNull(result);
        assertEquals("John Doe", result.getFullName());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void testGetCustomerById() {
        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(customerMapper.customerToCustomerDto(customer)).thenReturn(customerDTO);

        CustomerDTO result = customerService.getCustomer(1);
        assertNotNull(result);
        assertEquals("John Doe", result.getFullName());
        verify(customerRepository, times(1)).findById(1);
    }

    @Test
    void testUpdateCustomer() {
        int customerId = 1;

        // New update values
        CustomerDTO updatedDTO = new CustomerDTO();
        updatedDTO.setFullName("Updated Name");
        updatedDTO.setAge(28);
        //updatedDTO.setGender("Female");
        updatedDTO.setMobileNumber("9876543210");

        AddressDTO updatedAddressDTO = new AddressDTO();
        updatedAddressDTO.setStreet("New Street");
        updatedAddressDTO.setCity("New City");
        updatedAddressDTO.setState("New State");
        updatedAddressDTO.setPincode("654321");

        Address updatedAddress = new Address();
        updatedAddress.setAddressId(2);
        updatedDTO.setAddress(updatedAddressDTO);

        // Mock update behavior
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(addressMapper.addressDtoToAddress(updatedAddressDTO)).thenReturn(updatedAddress);
        when(addressRepository.save(updatedAddress)).thenReturn(updatedAddress);
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(customerMapper.customerToCustomerDto(customer)).thenReturn(updatedDTO);

        CustomerDTO result = customerService.updateCustomer(customerId, updatedDTO);

        assertNotNull(result);
        assertEquals("Updated Name", result.getFullName());
        assertEquals("9876543210", result.getMobileNumber());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void testDeleteCustomer() {
        int customerId = 1;

        doNothing().when(customerRepository).deleteById(customerId);

        customerService.deleteCustomer(customerId);

        verify(customerRepository, times(1)).deleteById(customerId);
    }
}