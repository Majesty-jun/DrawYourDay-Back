import { Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
  ) {}

  create(createWeatherDto: CreateWeatherDto) {
    return this.weatherRepository.save(createWeatherDto);
  }

  findAll() {
    return this.weatherRepository.find();
  }

  findOne(weatherId: number) {
    return this.weatherRepository.findOneBy({ weatherId });
  }

  update(weatherId: number, updateWeatherDto: UpdateWeatherDto) {
    return this.weatherRepository.update(weatherId, updateWeatherDto);
  }
}
